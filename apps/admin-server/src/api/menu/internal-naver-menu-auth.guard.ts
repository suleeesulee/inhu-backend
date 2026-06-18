import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import {
  NAVER_MENU_INTERNAL_AUTH_HEADERS,
  verifyNaverMenuInternalSignature,
} from './internal-naver-menu-auth.util';

const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

@Injectable()
export class InternalNaverMenuAuthGuard implements CanActivate {
  private readonly INTERNAL_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.INTERNAL_SECRET =
      this.configService.get<string>('naverMenuWorker.internalSecret') || '';
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    if (!this.INTERNAL_SECRET) {
      throw new UnauthorizedException(
        'Internal crawling secret not configured',
      );
    }

    const timestamp = this.getHeader(
      request,
      NAVER_MENU_INTERNAL_AUTH_HEADERS.timestamp,
    );
    const nonce = this.getHeader(
      request,
      NAVER_MENU_INTERNAL_AUTH_HEADERS.nonce,
    );
    const signature = this.getHeader(
      request,
      NAVER_MENU_INTERNAL_AUTH_HEADERS.signature,
    );

    if (!timestamp || !nonce || !signature) {
      throw new UnauthorizedException('Internal crawling signature missing');
    }

    // timestamp 검증: 요청이 너무 오래된 경우(5분 이상) 인증 실패
    if (Math.abs(Date.now() - Number(timestamp)) > MAX_CLOCK_SKEW_MS) {
      throw new UnauthorizedException('Internal crawling signature expired');
    }

    const isValid = verifyNaverMenuInternalSignature(
      this.INTERNAL_SECRET,
      {
        timestamp,
        nonce,
        naverPlaceId: (request.body as { naverPlaceId?: string })?.naverPlaceId,
      },
      signature,
    );

    if (!isValid) {
      throw new UnauthorizedException('Internal crawling signature invalid');
    }

    return true;
  }

  private getHeader(request: Request, name: string): string | null {
    const value = request.headers[name];

    if (Array.isArray(value)) {
      return value[0] ?? null;
    }

    return value ?? null;
  }
}
