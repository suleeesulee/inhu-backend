import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_REWARD, SelectReward } from './model/prisma-type/select-reward';
import { CreateRewardInput } from './inputs/create-reward.input';
import { UpdateRewardInput } from './inputs/update-reward.input';

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

  public async selectRewardAll(): Promise<SelectReward[]> {
    return await this.txHost.tx.reward.findMany({
      ...SELECT_REWARD,
      where: {
        deletedAt: null,
      },
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

  public async updateReward(
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

  public async softDeleteReward(idx: number): Promise<void> {
    await this.txHost.tx.reward.update({
      data: { deletedAt: new Date() },
      where: { idx, deletedAt: null },
    });
  }
}
