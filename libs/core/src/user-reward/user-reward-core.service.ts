import { Injectable } from '@nestjs/common';
import { UserRewardCoreRepository } from './user-reward-core.repository';

@Injectable()
export class UserRewardCoreService {
  constructor(
    private readonly userRewardCoreRepository: UserRewardCoreRepository,
  ) {}

  public async getUserRewardWithRankByUserIdx() {
    return await this.userRewardCoreRepository.selectUserRewardWithRankByUserIdx();
  }

  public async createUserReward() {
    return await this.userRewardCoreRepository.insertUserReward();
  }
}
