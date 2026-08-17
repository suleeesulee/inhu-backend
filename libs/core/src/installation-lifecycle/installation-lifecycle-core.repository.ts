import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { UpsertInstallationIdInput } from './inputs/upsert-installation-id.input';
import { UpdateInstallIdInput } from './inputs/update-installation-id.input';
import {
  SELECT_INSTALLATION_LIFECYCLE,
  SelectInstallationLifecycle,
} from './model/prisma-type/select-installation-lifecycle';

@Injectable()
export class InstallationLifecycleCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async upsertInstallationLifecycle(input: UpsertInstallationIdInput) {
    return await this.txHost.tx.installation.upsert({
      where: {
        id: input.installationId,
      },
      create: {
        id: input.installationId,
        appVersion: input.appVersion,
        platform: input.platform,
        refreshTokenExpiresAt: input.refreshTokenExpiredAt,
        userIdx: input.userIdx,
      },
      update: {
        appVersion: input.appVersion,
        platform: input.platform,
        refreshTokenExpiresAt: input.refreshTokenExpiredAt,
        userIdx: input.userIdx,
        updatedAt: new Date(),
      },
    });
  }

  public async updateInstallationLifecycleById(
    id: string,
    input: UpdateInstallIdInput,
  ) {
    return await this.txHost.tx.installation.update({
      where: { id },
      data: {
        refreshTokenExpiresAt: input.refreshTokenExpiredAt,
        userIdx: input.userIdx,
        updatedAt: new Date(),
      },
    });
  }

  public async selectInstallationLifecycleByUserIdx(
    userIdx: number,
  ): Promise<SelectInstallationLifecycle[]> {
    return await this.txHost.tx.installation.findMany({
      select: SELECT_INSTALLATION_LIFECYCLE.select,
      where: { userIdx },
    });
  }
}
