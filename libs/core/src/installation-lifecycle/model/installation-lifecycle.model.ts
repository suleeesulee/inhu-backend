import { SelectInstallationLifecycle } from './prisma-type/select-installation-lifecycle';

export class InstallationLifecycleModel {
  public id: string;
  public userIdx: number | null;
  public refreshTokenExpiresAt: Date | null;
  public platform: string;
  public updatedAt: Date;
  public appVersion: string;
  public createdAt: Date;

  constructor(data: InstallationLifecycleModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(installation: SelectInstallationLifecycle) {
    return new InstallationLifecycleModel({
      id: installation.id,
      appVersion: installation.appVersion,
      createdAt: installation.createdAt,
      updatedAt: installation.updatedAt,
      platform: installation.platform,
      refreshTokenExpiresAt: installation.refreshTokenExpiresAt,
      userIdx: installation.userIdx,
    });
  }
}
