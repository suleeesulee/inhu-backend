import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateInputWrapper } from '../types/input-wrapper';
import { CreateDimMainCategoryInput } from './inputs/create-dim-main-category.input';

@Injectable()
export class MainCategoryLogCoreRepository {
  constructor(
    @InjectTransactionHost(LOG_PRISMA_KEY)
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<LogPrismaService>
    >,
  ) {}

  public async insertDimMainCategoryMapping(
    input: CreateInputWrapper<CreateDimMainCategoryInput>,
  ) {
    return await this.txHost.tx.dimMainCategories.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        content: input.content,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        content: input.content,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
    });
  }
}
