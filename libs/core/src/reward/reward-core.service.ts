import { Injectable } from '@nestjs/common';
import { RewardCoreRepository } from './reward-core.repository';
import { RewardModel } from './model/reward.model';
import { CreateRewardInput } from './inputs/create-reward.input';
import { UpdateRewardInput } from './inputs/update-reward.input';

@Injectable()
export class RewardCoreService {
  constructor(private readonly rewardCoreRepository: RewardCoreRepository) {}

  public async getRewardByIdx(idx: number): Promise<RewardModel | null> {
    const reward = await this.rewardCoreRepository.selectRewardByIdx(idx);
    return reward && RewardModel.fromPrisma(reward);
  }

  public async getRewardAll(): Promise<RewardModel[]> {
    return (await this.rewardCoreRepository.selectRewardAll()).map(
      RewardModel.fromPrisma,
    );
  }

  public async createReward(input: CreateRewardInput): Promise<RewardModel> {
    return RewardModel.fromPrisma(
      await this.rewardCoreRepository.insertReward(input),
    );
  }

  public async updateReward(
    idx: number,
    input: UpdateRewardInput,
  ): Promise<void> {
    await this.rewardCoreRepository.updateReward(idx, input);
  }

  public async deleteReward(idx: number): Promise<void> {
    await this.rewardCoreRepository.softDeleteReward(idx);
  }
}
