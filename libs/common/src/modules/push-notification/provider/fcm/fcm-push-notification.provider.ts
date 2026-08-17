import * as path from 'path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { Messaging, getMessaging } from 'firebase-admin/messaging';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IPushNotificationProvider,
  PushNotificationPayload,
} from '../../interface/push-notification-provider.interface';

/**
 * FCM (Firebase Cloud Messaging) 프로바이더
 *
 * - 프로젝트 루트의 서비스 계정 JSON 파일로 초기화
 * - firebase-admin SDK가 OAuth2 토큰 관리를 내부적으로 처리
 */
@Injectable()
export class FcmPushNotificationProvider
  implements IPushNotificationProvider, OnModuleInit
{
  private readonly logger = new Logger(FcmPushNotificationProvider.name);
  private readonly keyFile: string;
  private messaging: Messaging;

  constructor(configService: ConfigService) {
    const keyFile = configService.get<string>('pushNotification.fcm.keyFile')!;
    this.keyFile = path.resolve(process.cwd(), keyFile);
  }

  public onModuleInit() {
    if (!getApps().length) {
      initializeApp({ credential: cert(this.keyFile) });
    }

    this.messaging = getMessaging();
    this.logger.log(`FCM initialized with key file: ${this.keyFile}`);
  }

  public async send(
    token: string,
    payload: PushNotificationPayload,
  ): Promise<void> {
    await this.messaging.send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
      android: {
        priority: 'high',
      },
    });
  }
}
