import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  SELECT_PUSH_TOKEN,
  SelectPushToken,
} from './model/prisma-type/select-push-token';

@Injectable()
export class PushTokenCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectPushTokenById(
    id: string,
  ): Promise<SelectPushToken | null> {
    return await this.txHost.tx.pushToken.findUnique({
      select: SELECT_PUSH_TOKEN.select,
      where: { id },
    });
  }

  public async insertPushToken(id: string, expoPushToken: string) {
    return await this.txHost.tx.pushToken.create({
      data: { id, expoPushToken },
    });
  }

  public async updatePushToken(id: string, expoPushToken: string) {
    return await this.txHost.tx.pushToken.update({
      where: { id },
      data: {
        expoPushToken,
        lastSeenAt: new Date(),
      },
    });
  }

  public async deletePushToken(id: string) {
    return await this.txHost.tx.pushToken.delete({
      where: { id },
    });
  }
}
