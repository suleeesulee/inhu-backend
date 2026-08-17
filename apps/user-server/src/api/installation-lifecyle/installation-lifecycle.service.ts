import { Injectable } from '@nestjs/common';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
import { RegisterInstallationLifecycleDto } from './dto/request/register-installation-lifecycle.dto';
import { InstallationLifecycleCoreService } from '@libs/core/installation-lifecycle/installation-lifecycle-core.service';
import { UpsertInstallationIdInput } from '@libs/core/installation-lifecycle/inputs/upsert-installation-id.input';
import { Transactional } from '@nestjs-cls/transactional';
import { PushTokenCoreService } from '@libs/core/push-notification/push-token-core.service';

@Injectable()
export class InstallationLifecycleService {
  constructor(
    private readonly loginTokenService: LoginTokenService,
    private readonly installationLifecycleCoreService: InstallationLifecycleCoreService,
    private readonly pushTokenCoreService: PushTokenCoreService,
  ) {}

  @Transactional()
  public async registerLifecycle(dto: RegisterInstallationLifecycleDto) {
    const input = await this.processDtoToInput(dto);

    await this.installationLifecycleCoreService.upsertInstallationLifecycle(
      input,
    );

    console.log(dto);

    await this.pushTokenCoreService.syncPushToken(
      dto.installationId,
      dto.pushNotificationToken,
    );
  }

  private async processDtoToInput(
    dto: RegisterInstallationLifecycleDto,
  ): Promise<UpsertInstallationIdInput> {
    if (!dto.refreshToken) {
      return {
        appVersion: dto.appVersion,
        installationId: dto.installationId,
        platform: dto.platform,
        refreshTokenExpiredAt: null,
        userIdx: null,
      };
    }

    const refreshTokenInfo = await this.loginTokenService.verifyRefreshToken(
      dto.refreshToken,
    );

    const refreshTokenExpiredAt = new Date(refreshTokenInfo.exp * 1000);

    return {
      appVersion: dto.appVersion,
      installationId: dto.installationId,
      platform: dto.platform,
      refreshTokenExpiredAt,
      userIdx: refreshTokenInfo.idx,
    };
  }
}
