import * as crypto from 'crypto';
import * as http2 from 'http2';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IPushNotificationProvider,
  PushNotificationPayload,
} from '@libs/common/modules/push-notification/interface/push-notification-provider.interface';

/**
 * APNs (Apple Push Notification service) 프로바이더
 *
 * - JWT 토큰 기반 인증 (ES256)
 * - HTTP/2 커넥션 재사용
 * - JWT는 50분 주기로 갱신 (APNs는 최대 1시간 유효)
 */
@Injectable()
export class ApnsPushNotificationProvider implements IPushNotificationProvider {
  private readonly logger = new Logger(ApnsPushNotificationProvider.name);

  private readonly host: string;
  private readonly bundleId: string;
  private readonly teamId: string;
  private readonly keyId: string;
  private readonly privateKey: string;

  /** 캐시된 JWT와 발급 시각 (Unix seconds) */
  private cachedJwt: string | null = null;
  private jwtIssuedAt: number = 0;

  /** 재사용할 HTTP/2 클라이언트 세션 */
  private client: http2.ClientHttp2Session | null = null;

  private static readonly JWT_TTL_SECONDS = 50 * 60; // 50분

  constructor(configService: ConfigService) {
    const apnConfig = configService.get<{
      teamId: string;
      keyId: string;
      privateKey: string;
      bundleId: string;
    }>('pushNotification.apn');

    this.teamId = apnConfig!.teamId;
    this.keyId = apnConfig!.keyId;
    this.privateKey = apnConfig!.privateKey;
    this.bundleId = apnConfig!.bundleId;

    const isSandbox = process.env.NODE_ENV !== 'production';
    this.host = isSandbox
      ? 'https://api.sandbox.push.apple.com'
      : 'https://api.push.apple.com';
  }

  public async send(
    token: string,
    payload: PushNotificationPayload,
  ): Promise<void> {
    const jwt = this.getJwt();
    const client = this.getClient();
    const body = this.buildBody(payload);

    return new Promise((resolve, reject) => {
      const req = client.request({
        ':method': 'POST',
        ':path': `/3/device/${token}`,
        authorization: `bearer ${jwt}`,
        'apns-topic': this.bundleId,
        'apns-push-type': 'alert',
        'apns-priority': '10',
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(body),
      });

      let status: number;
      let responseBody = '';

      req.setEncoding('utf8');

      req.on('response', (headers) => {
        status = Number(headers[':status']);
      });

      req.on('data', (chunk) => {
        responseBody += chunk;
      });

      req.on('end', () => {
        req.close();

        if (status === 200) {
          resolve();
          return;
        }

        if (this.isDeviceTokenUnregistered(status, responseBody)) {
          reject(new ApnsDeviceTokenUnregisteredException(token, responseBody));
          return;
        }

        this.logger.error(
          `APNs error: status=${status}, body=${responseBody}, token=${token}`,
        );
        reject(new ApnsException(status, responseBody));
      });

      req.on('error', (err) => {
        // 커넥션 에러 시 세션 초기화 (다음 호출에서 재연결)
        this.client = null;
        reject(err);
      });

      req.write(body);
      req.end();
    });
  }

  /**
   * JWT를 반환합니다. 50분이 지났으면 재발급합니다.
   */
  private getJwt(): string {
    const now = Math.floor(Date.now() / 1000);

    if (
      this.cachedJwt &&
      now - this.jwtIssuedAt < ApnsPushNotificationProvider.JWT_TTL_SECONDS
    ) {
      return this.cachedJwt;
    }

    this.cachedJwt = this.generateJwt(now);
    this.jwtIssuedAt = now;

    return this.cachedJwt;
  }

  /**
   * APNs용 ES256 JWT를 생성합니다.
   *
   * 서명 포맷: IEEE P1363 (raw r||s) — JWT ES256 스펙 준수
   */
  private generateJwt(iat: number): string {
    const header = this.base64url(
      JSON.stringify({ alg: 'ES256', kid: this.keyId }),
    );
    const payload = this.base64url(JSON.stringify({ iss: this.teamId, iat }));

    const unsignedToken = `${header}.${payload}`;

    const signature = crypto
      .sign('sha256', Buffer.from(unsignedToken), {
        key: this.privateKey,
        dsaEncoding: 'ieee-p1363', // JWT ES256 스펙: raw (r||s) 포맷
      })
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return `${unsignedToken}.${signature}`;
  }

  /**
   * HTTP/2 클라이언트 세션을 반환합니다.
   * 세션이 없거나 닫혀있으면 재연결합니다.
   */
  private getClient(): http2.ClientHttp2Session {
    if (this.client && !this.client.destroyed && !this.client.closed) {
      return this.client;
    }

    this.client = http2.connect(this.host);

    this.client.on('error', (err) => {
      this.logger.error(`APNs HTTP/2 session error: ${err.message}`);
      this.client = null;
    });

    this.client.on('close', () => {
      this.client = null;
    });

    return this.client;
  }

  private buildBody(payload: PushNotificationPayload): string {
    return JSON.stringify({
      aps: {
        alert: {
          title: payload.title,
          body: payload.body,
        },
        sound: 'default',
      },
      ...(payload.data ?? {}),
    });
  }

  private isDeviceTokenUnregistered(
    status: number,
    responseBody: string,
  ): boolean {
    try {
      const { reason } = JSON.parse(responseBody) as { reason?: string };

      return status === 410 && reason === 'Unregistered';
    } catch {
      return false;
    }
  }

  private base64url(input: string): string {
    return Buffer.from(input)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}

export class ApnsException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly responseBody: string,
  ) {
    super(`APNs error: status=${statusCode}, body=${responseBody}`);
  }
}

export class ApnsDeviceTokenInvalidException extends ApnsException {
  constructor(
    public readonly deviceToken: string,
    statusCode: number,
    responseBody: string,
  ) {
    super(statusCode, responseBody);
  }
}

export class ApnsDeviceTokenUnregisteredException extends ApnsDeviceTokenInvalidException {
  constructor(deviceToken: string, responseBody: string) {
    super(deviceToken, 410, responseBody);
  }
}
