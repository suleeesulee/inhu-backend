import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateUserRewardInput } from './input/create-user-reward.input';
import {
  SELECT_USER_REWARD,
  SelectUserReward,
} from './model/prisma-type/select-user-reward';
import { UpdateUserRewardInput } from './input/update-user-reward.input';
import { GetUserRewardInput } from './input/get-user-reward.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRewardCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectUserRewardById(
    id: string,
  ): Promise<SelectUserReward | null> {
    return await this.txHost.tx.userReward.findUnique({
      ...SELECT_USER_REWARD,
      where: { id },
    });
  }

  public async selectUserRewardAll(
    input: GetUserRewardInput,
  ): Promise<SelectUserReward[]> {
    return await this.txHost.tx.userReward.findMany({
      ...SELECT_USER_REWARD,
      where: {
        AND: [this.getPendingIssuanceFilterWhereClause(input.issued)],
      },
      orderBy: { createdAt: 'desc' },
      take: input.take,
      skip: input.skip,
    });
  }

  public async insertUserReward(
    input: CreateUserRewardInput,
  ): Promise<SelectUserReward> {
    return await this.txHost.tx.userReward.create({
      ...SELECT_USER_REWARD,
      data: {
        rewardIdx: input.rewardIdx,
        leagueSeasonResultId: input.leagueSeasonResultId,
        selectedAt: input.selectedAt,
        issuedAt: input.issuedAt,
      },
    });
  }

  public async updateUserRewardById(
    id: string,
    input: UpdateUserRewardInput,
  ): Promise<void> {
    await this.txHost.tx.userReward.update({
      where: { id },
      data: {
        rewardIdx: input.rewardIdx,
        leagueSeasonResultId: input.leagueSeasonResultId,
        selectedAt: input.selectedAt,
        issuedAt: input.issuedAt,
      },
    });
  }

  private getPendingIssuanceFilterWhereClause(
    issued?: boolean,
  ): Prisma.UserRewardWhereInput {
    if (issued === undefined) {
      return {};
    }

    if (issued) {
      return {
        selectedAt: { not: null },
        rewardIdx: { not: null },
        issuedAt: null,
      };
    }

    return {
      issuedAt: { not: null },
    };
  }
}
