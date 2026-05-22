import { MailService } from '@libs/common/modules/mail/mail.service';
import { RedisService } from '@libs/common/modules/redis/redis.service';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class UserMailService {
  constructor(
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly userCoreService: UserCoreService,
  ) {}

  async sendVerificationCode(userIdx: number, email: string): Promise<void> {
    if (!email.endsWith('inha.edu')) {
      throw new ForbiddenException('인하대학교 이메일만 사용할 수 있습니다.');
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.redisService.set(
      this.getTokenKey(userIdx),
      verificationCode,
      'EX',
      300,
    );

    await this.mailService.sendMail(
      email,
      '인하대학교 이메일 인증 코드',
      `인증 코드는 ${verificationCode}입니다. 이 코드는 5분 동안 유효합니다.`,
    );
  }

  async verifyCode(userIdx: number, code: string): Promise<boolean> {
    const storedCode = await this.redisService.get(this.getTokenKey(userIdx));

    if (storedCode === code) {
      await this.redisService.del(this.getTokenKey(userIdx));
      await this.userCoreService.updateUserByIdx(userIdx, {
        isSchoolVerified: true,
      });

      return true;
    }

    return false;
  }

  private getTokenKey(userIdx: number): string {
    return `mail-token:${userIdx}`;
  }
}
