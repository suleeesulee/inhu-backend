import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { UserModel } from '@libs/core/user/model/user.model';
import { UserCoreService } from '@libs/core/user/user-core.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ISocialLoginStrategy } from '@user/api/auth/social-login/ISocialLogin-strategy.interface';
import { AppleLoginStrategy } from '@user/api/auth/social-login/strategy/apple/apple-login.strategy';
import { KakaoLoginStrategy } from '@user/api/auth/social-login/strategy/kakao/kakao-login.strategy';
import { OAuthInfo } from '@user/api/auth/types/OAuthInfo';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
import { Request } from 'express';
import { GuestLoginDto } from './dto/request/guest-login.dto';
import { InstallationLifecycleCoreService } from '@libs/core/installation-lifecycle/installation-lifecycle-core.service';

@Injectable()
export class AuthService {
  private readonly socialAuthProviderMap: Record<
    AuthProvider,
    ISocialLoginStrategy
  >;

  constructor(
    private readonly kakaoLoginStrategy: KakaoLoginStrategy,
    private readonly appleLoginStrategy: AppleLoginStrategy,
    private readonly userCoreService: UserCoreService,
    private readonly loginTokenService: LoginTokenService,
    private readonly installationLifecycleCoreService: InstallationLifecycleCoreService,
  ) {
    this.socialAuthProviderMap = {
      [AuthProvider.KAKAO]: this.kakaoLoginStrategy,
      [AuthProvider.APPLE]: this.appleLoginStrategy,
    };
  }

  public async getSocialLoginRedirect(provider: AuthProvider) {
    const strategy = this.socialAuthProviderMap[provider];

    if (!strategy) {
      throw new InternalServerErrorException();
    }

    return strategy.getSocialLoginRedirect();
  }

  // !게스트 로그인 (temporary)
  public async guestLogin(issuedBy: TokenIssuedBy, dto: GuestLoginDto) {
    if (dto.pw !== '000908') {
      throw new ForbiddenException('Invalid guest login password');
    }

    const userModel = await this.userCoreService.getUserByNickname('guest');
    if (!userModel) {
      throw new NotFoundException('Guest user not found');
    }

    return await this.loginTokenService.issueTokenSet(
      { idx: userModel.idx },
      issuedBy,
    );
  }

  public async login(
    req: Request,
    provider: AuthProvider,
    issuedBy: TokenIssuedBy,
  ) {
    const strategy = this.socialAuthProviderMap[provider];
    if (!strategy) {
      throw new InternalServerErrorException();
    }

    const oauthInfo = await strategy.socialLogin(provider, req);

    const platform =
      issuedBy === TokenIssuedBy.WEB
        ? 'web'
        : this.extractPlatformFromHeader(req);
    const userModel = await this.upsertUserByOauthInfo(oauthInfo, platform);

    // 해당 사용자가 정지되었는지 판단하거나 등등

    // refresh token 만드는 로직
    return await this.loginTokenService.issueTokenSet(
      { idx: userModel.idx },
      issuedBy,
    );
  }

  private async upsertUserByOauthInfo(
    oauthInfo: OAuthInfo,
    platform: 'unknown' | 'web' | 'android' | 'ios',
  ): Promise<UserModel> {
    const user = await this.userCoreService.getUserBySocialId(
      oauthInfo.snsId,
      oauthInfo.provider,
    );

    if (user) {
      return user;
    }

    return await this.userCoreService.createUser({
      nickname: '새로운 인후러',
      profileImagePath: null,
      platform,
      social: {
        provider: oauthInfo.provider,
        snsId: oauthInfo.snsId,
      },
    });
  }

  public async reissueAccessToken(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('There is no refresh token');
    }

    const { accessToken } =
      await this.loginTokenService.reissueAccessToken(refreshToken);

    return { accessToken };
  }

  public async logout(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    try {
      const { idx, issuedBy, jti } =
        await this.loginTokenService.verifyRefreshToken(refreshToken);

      const result =
        await this.installationLifecycleCoreService.getInstallationIdByUserIdx(
          idx,
        );

      if (result) {
        await this.installationLifecycleCoreService.disconnectInstallationIdWithUser(
          result.id,
        );
      }

      await this.loginTokenService.invalidateRefreshTokenById(
        idx,
        jti,
        issuedBy,
      );
    } catch (err) {
      return;
    }
  }

  private extractPlatformFromHeader(
    req: Request,
  ): 'unknown' | 'web' | 'android' | 'ios' {
    const platform: string | string[] = req.headers.platform || '';

    if (platform === 'web') {
      return 'web';
    }
    if (platform === 'android') {
      return 'android';
    }
    if (platform === 'ios') {
      return 'ios';
    }

    return 'unknown';
  }
}
