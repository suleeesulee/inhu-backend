import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateInputWrapper } from '../types/input-wrapper';
import { CreateDimMoodCategoryInput } from './inputs/create-dim-mood-category.input';

@Injectable()
export class MoodCategoryLogCoreRepository {
  constructor(
    @InjectTransactionHost(LOG_PRISMA_KEY)
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<LogPrismaService>
    >,
  ) {}

  public async insertDimMoodCategory(
    input: CreateInputWrapper<CreateDimMoodCategoryInput>,
  ) {
    return await this.txHost.tx.dimMoodCategories.upsert({
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
