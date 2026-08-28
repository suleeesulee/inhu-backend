import { Injectable } from '@nestjs/common';
import { InstallationLifecycleCoreRepository } from './installation-lifecycle-core.repository';
import { UpsertInstallationIdInput } from './inputs/upsert-installation-id.input';
import { InstallationLifecycleModel } from './model/installation-lifecycle.model';

@Injectable()
export class InstallationLifecycleCoreService {
  constructor(
    private readonly installationLifecycleRepository: InstallationLifecycleCoreRepository,
  ) {}

  /**
   * installation 등록
   *
   * @publicApi
   */
  public async upsertInstallationLifecycle(input: UpsertInstallationIdInput) {
    return await this.installationLifecycleRepository.upsertInstallationLifecycle(
      input,
    );
  }

  /**
   * installation - user 커넥션 끊기
   * 로그아웃 시에 사용
   *
   * @publicApi
   */
  public async disconnectInstallationIdWithUser(id: string) {
    await this.installationLifecycleRepository.updateInstallationLifecycleById(
      id,
      {
        refreshTokenExpiredAt: null,
        userIdx: null,
      },
    );
  }

  /**
   * installation 찾기
   *
   * @publicApi
   */
  public async getInstallationIdByUserIdx(
    userIdx: number,
  ): Promise<InstallationLifecycleModel | null> {
    const result =
      await this.installationLifecycleRepository.selectInstallationLifecycleByUserIdx(
        userIdx,
      );

    if (!result[0]) return null;

    return InstallationLifecycleModel.fromPrisma(result[0]);
  }
}
