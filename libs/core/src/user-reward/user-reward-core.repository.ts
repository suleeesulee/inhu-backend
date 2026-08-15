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
import { UserRewardStatus } from './constants/user-reward-status.enum';

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
        ...this.getStatusFilterWhereClause(input.status),
        leagueSeasonResult: input.leagueSeasonIdx
          ? { leagueSeasonIdx: input.leagueSeasonIdx }
          : undefined,
      },
      orderBy: [{ createdAt: input.order ?? 'desc' }, { id: 'desc' }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectUserRewardByLeagueSeasonResultId(
    leagueSeasonResultId: string,
  ): Promise<SelectUserReward | null> {
    return await this.txHost.tx.userReward.findFirst({
      ...SELECT_USER_REWARD,
      where: { leagueSeasonResultId },
    });
  }

  public async selectUserRewardAllByLeagueSeasonResultIdList(
    leagueSeasonResultIdList: string[],
  ): Promise<SelectUserReward[]> {
    if (leagueSeasonResultIdList.length === 0) {
      return [];
    }

    return await this.txHost.tx.userReward.findMany({
      ...SELECT_USER_REWARD,
      where: {
        leagueSeasonResultId: { in: leagueSeasonResultIdList },
      },
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

  private getStatusFilterWhereClause(
    status?: UserRewardStatus,
  ): Prisma.UserRewardWhereInput {
    if (status === undefined) {
      return {};
    }

    if (status === UserRewardStatus.UNSELECTED) {
      return {
        selectedAt: null,
        rewardIdx: null,
        issuedAt: null,
      };
    }

    if (status === UserRewardStatus.PENDING_ISSUANCE) {
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
