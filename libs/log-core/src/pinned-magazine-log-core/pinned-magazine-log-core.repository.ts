import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateInputWrapper } from '../types/input-wrapper';
import { CreateDimPinnedMagazineInput } from './inputs/create-dim-keyword.input';

@Injectable()
export class PinnedMagazineLogCoreRepository {
  constructor(
    @InjectTransactionHost(LOG_PRISMA_KEY)
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<LogPrismaService>
    >,
  ) {}

  public async insertDimPinnedMagazine(
    input: CreateInputWrapper<CreateDimPinnedMagazineInput>,
  ) {
    return await this.txHost.tx.dimPinnedMagazines.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
    });
  }
}
