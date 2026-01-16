import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateDimUserInput } from './inputs/create-dim-user.input';
import { CreateInputWrapper } from '../types/input-wrapper';
import { CreateDimUserProviderInput } from './inputs/create-dim-user-provider.input';

@Injectable()
export class UserLogCoreRepository {
  constructor(
    @InjectTransactionHost(LOG_PRISMA_KEY)
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<LogPrismaService>
    >,
  ) {}

  public async insertDimUser(input: CreateInputWrapper<CreateDimUserInput>) {
    return await this.txHost.tx.dimUsers.create({
      data: {
        idx: input.idx,
        platform: input.platform,
        signupAt: input.signupAt,
        validFrom: input.validFrom,
        deletedAt: input.deletedAt,
      },
    });
  }

  public async updateDimUser(idx: number, validTo: Date) {
    await this.txHost.tx.dimUsers.updateMany({
      data: { validTo },
      where: {
        idx,
        validTo: null,
      },
    });
  }

  public async insertDimUserProvider(
    input: CreateInputWrapper<CreateDimUserProviderInput>,
  ) {
    await this.txHost.tx.dimUserProviders.create({
      data: {
        idx: input.idx,
        provider: input.provider,
        validFrom: input.validFrom,
      },
    });
  }

  public async updateDimUserProvider(idx: number, validTo: Date) {
    await this.txHost.tx.dimUserProviders.updateMany({
      data: { validTo },
      where: {
        idx,
        validTo: null,
      },
    });
  }
}
