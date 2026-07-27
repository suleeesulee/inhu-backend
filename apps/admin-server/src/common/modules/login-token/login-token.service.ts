import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { RedisService } from '@libs/common/modules/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidLoginTokenException } from 'apps/admin-server/src/common/modules/login-token/exception/invalid-login-token.exception';
import { TokenPayload } from 'apps/admin-server/src/common/modules/login-token/types/TokenPayload';

@Injectable()
export class LoginTokenService {
  private readonly TOKEN_SECRET: string;
  private readonly TOKEN_EXPIRATION: string;

  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    const config = configService.get('jwt');

    this.TOKEN_SECRET = config.secret;
    this.TOKEN_EXPIRATION = config.expiresIn;
  }

  public async generateAdminToken(
    userIdx: number,
    role: AdminRole,
  ): Promise<string> {
    const tokenPayload: TokenPayload = {
      idx: userIdx,
      role,
    };

    const token = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: this.TOKEN_EXPIRATION,
    });

    await this.redisService.set(
      this.getTokenKey(userIdx),
      token,
      'EX',
      this.getTtlSeconds(),
    );

    return token;
  }

  public async verifyAdminToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.TOKEN_SECRET,
      });

      const exists = await this.redisService.get(this.getTokenKey(payload.idx));
      if (!exists) {
        throw new InvalidLoginTokenException('Token revoked');
      }

      return payload;
    } catch (error) {
      throw new InvalidLoginTokenException('Invalid or expired token');
    }
  }

  public async revokeAdminToken(userIdx: number): Promise<void> {
    await this.redisService.del(this.getTokenKey(userIdx));
  }

  private getTokenKey(userIdx: number): string {
    return `admin:${userIdx}:token`;
  }

  private getTtlSeconds(): number {
    const exp = this.TOKEN_EXPIRATION.trim();
    if (exp.endsWith('h')) return Number(exp.slice(0, -1)) * 60 * 60;
    if (exp.endsWith('m')) return Number(exp.slice(0, -1)) * 60;
    if (exp.endsWith('s')) return Number(exp.slice(0, -1));
    return Number(exp);
  }
}
