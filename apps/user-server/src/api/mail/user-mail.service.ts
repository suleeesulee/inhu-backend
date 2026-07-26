import { MailService } from '@libs/common/modules/mail/mail.service';
import { RedisService } from '@libs/common/modules/redis/redis.service';
import { UserCoreService } from '@libs/core/user/user-core.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserMailService {
  private readonly schoolEmailDomains: string[];

  constructor(
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly userCoreService: UserCoreService,
    private readonly configService: ConfigService,
  ) {
    this.schoolEmailDomains =
      this.configService.get<string[]>('userMail.schoolEmailDomains') || [];
  }

  async sendVerificationCode(userIdx: number, email: string): Promise<void> {
    const normalizedEmail = email.toLocaleLowerCase();
    if (!this.isSupportedSchoolEmail(normalizedEmail)) {
      throw new ForbiddenException('지원하지 않는 이메일입니다.');
    }

    const userModel =
      await this.userCoreService.getUserBySchoolEmail(normalizedEmail);
    if (userModel && userModel.schoolEmail === normalizedEmail) {
      throw new ConflictException('이미 인증된 이메일입니다.');
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.redisService.set(
      this.getTokenKey(userIdx),
      JSON.stringify({
        code: verificationCode,
        email: normalizedEmail,
      }),
      'EX',
      300,
    );

    await this.mailService.sendMail(
      email,
      '이메일 인증 코드',
      `인증 코드는 ${verificationCode}입니다. 이 코드는 5분 동안 유효합니다.`,
    );
  }

  async verifyCode(userIdx: number, code: string): Promise<boolean> {
    const storedToken = await this.redisService.get(this.getTokenKey(userIdx));

    if (!storedToken) {
      return false;
    }

    const { code: storedCode, email } = JSON.parse(storedToken) as {
      code: string;
      email: string;
    };

    if (storedCode !== code) {
      return false;
    }

    await this.redisService.del(this.getTokenKey(userIdx));
    await this.userCoreService.updateUserByIdx(userIdx, {
      schoolEmail: email,
    });

    return true;
  }

  private getTokenKey(userIdx: number): string {
    return `mail-token:${userIdx}`;
  }

  private isSupportedSchoolEmail(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const emailParts = normalizedEmail.split('@');
    const emailDomain = emailParts[emailParts.length - 1];

    return !!emailDomain && this.schoolEmailDomains.includes(emailDomain);
  }
}
