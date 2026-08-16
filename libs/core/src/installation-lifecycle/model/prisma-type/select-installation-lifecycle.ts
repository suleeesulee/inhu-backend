import { Prisma } from '@prisma/client';

export const SELECT_INSTALLATION_LIFECYCLE =
  Prisma.validator<Prisma.InstallationDefaultArgs>()({
    select: {
      id: true,
      userIdx: true,
      updatedAt: true,
      appVersion: true,
      platform: true,
      refreshTokenExpiresAt: true,
      createdAt: true,
    },
  });

export type SelectInstallationLifecycle = Prisma.InstallationGetPayload<
  typeof SELECT_INSTALLATION_LIFECYCLE
>;
