import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_REWARD, SelectReward } from './model/prisma-type/select-reward';
import { CreateRewardInput } from './inputs/create-reward.input';
import { UpdateRewardInput } from './inputs/update-reward.input';
import { GetRewardAllInput } from './inputs/get-reward-all.input';

@Injectable()
export class RewardCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectRewardByIdx(idx: number): Promise<SelectReward | null> {
    return await this.txHost.tx.reward.findUnique({
      ...SELECT_REWARD,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectRewardAllByIdxList(
    idxList: number[],
  ): Promise<SelectReward[]> {
    if (idxList.length === 0) {
      return [];
    }

    return await this.txHost.tx.reward.findMany({
      ...SELECT_REWARD,
      where: { idx: { in: idxList } },
    });
  }

  public async selectRewardAll(
    input: GetRewardAllInput,
  ): Promise<SelectReward[]> {
    const order = input.order ?? 'desc';

    return await this.txHost.tx.reward.findMany({
      ...SELECT_REWARD,
      where: {
        deletedAt: null,
        activatedAt:
          input.activated === undefined
            ? undefined
            : input.activated
              ? { not: null }
              : null,
      },
      orderBy: [{ createdAt: order }, { idx: order }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async insertReward(input: CreateRewardInput): Promise<SelectReward> {
    return await this.txHost.tx.reward.create({
      ...SELECT_REWARD,
      data: {
        name: input.name,
        imagePath: input.imagePath,
        activatedAt: input.activatedAt,
      },
    });
  }

  public async updateRewardByIdx(
    idx: number,
    input: UpdateRewardInput,
  ): Promise<void> {
    await this.txHost.tx.reward.update({
      where: { idx },
      data: {
        name: input.name,
        imagePath: input.imagePath,
        activatedAt: input.activatedAt,
      },
    });
  }

  public async softDeleteRewardByIdx(idx: number): Promise<void> {
    await this.txHost.tx.reward.update({
      data: { deletedAt: new Date() },
      where: { idx, deletedAt: null },
    });
  }
}
