import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class PushTokenCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async upsertPushToken(id: string, expoPushToken: string) {
    return await this.txHost.tx.pushToken.upsert({
      where: { id },
      create: {
        id,
        expoPushToken,
      },
      update: {
        expoPushToken,
        lastSeenAt: new Date(),
      },
    });
  }

  public async invalidatePushToken() {}

  public async selectPushTokenById(id: string) {}
}
