import { Injectable } from '@nestjs/common';
import { RewardCoreRepository } from './reward-core.repository';
import { RewardModel } from './model/reward.model';
import { CreateRewardInput } from './inputs/create-reward.input';
import { UpdateRewardInput } from './inputs/update-reward.input';
import { GetRewardAllInput } from './inputs/get-reward-all.input';

@Injectable()
export class RewardCoreService {
  constructor(private readonly rewardCoreRepository: RewardCoreRepository) {}

  public async getRewardByIdx(idx: number): Promise<RewardModel | null> {
    const reward = await this.rewardCoreRepository.selectRewardByIdx(idx);
    return reward && RewardModel.fromPrisma(reward);
  }

  public async getRewardAllByIdxList(
    idxList: number[],
  ): Promise<RewardModel[]> {
    return (
      await this.rewardCoreRepository.selectRewardAllByIdxList(idxList)
    ).map(RewardModel.fromPrisma);
  }

  public async getRewardAll(input: GetRewardAllInput): Promise<RewardModel[]> {
    return (await this.rewardCoreRepository.selectRewardAll(input)).map(
      RewardModel.fromPrisma,
    );
  }

  public async getRewardCount(input: GetRewardAllInput): Promise<number> {
    return await this.rewardCoreRepository.selectRewardCount(input);
  }

  public async createReward(input: CreateRewardInput): Promise<RewardModel> {
    return RewardModel.fromPrisma(
      await this.rewardCoreRepository.insertReward(input),
    );
  }

  public async updateRewardByIdx(
    idx: number,
    input: UpdateRewardInput,
  ): Promise<void> {
    await this.rewardCoreRepository.updateRewardByIdx(idx, input);
  }

  public async deleteRewardByIdx(idx: number): Promise<void> {
    await this.rewardCoreRepository.softDeleteRewardByIdx(idx);
  }
}
