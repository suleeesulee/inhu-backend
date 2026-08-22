import { Injectable } from '@nestjs/common';
import { UserRewardCoreRepository } from './user-reward-core.repository';
import { UserRewardModel } from './model/user-reward.model';
import { GetUserRewardInput } from './input/get-user-reward.input';
import { CreateUserRewardInput } from './input/create-user-reward.input';
import { UpdateUserRewardInput } from './input/update-user-reward.input';

@Injectable()
export class UserRewardCoreService {
  constructor(
    private readonly userRewardCoreRepository: UserRewardCoreRepository,
  ) {}

  public async getUserRewardById(id: string): Promise<UserRewardModel | null> {
    const userReward =
      await this.userRewardCoreRepository.selectUserRewardById(id);
    return userReward && UserRewardModel.fromPrisma(userReward);
  }

  public async getUserRewardAll(
    input: GetUserRewardInput,
  ): Promise<UserRewardModel[]> {
    return (await this.userRewardCoreRepository.selectUserRewardAll(input)).map(
      UserRewardModel.fromPrisma,
    );
  }

  public async getUserRewardCount(input: GetUserRewardInput): Promise<number> {
    return await this.userRewardCoreRepository.selectUserRewardCount(input);
  }

  public async getUserRewardByLeagueSeasonResultId(
    leagueSeasonResultId: string,
  ): Promise<UserRewardModel | null> {
    const userReward =
      await this.userRewardCoreRepository.selectUserRewardByLeagueSeasonResultId(
        leagueSeasonResultId,
      );
    return userReward && UserRewardModel.fromPrisma(userReward);
  }

  public async getUserRewardAllByLeagueSeasonResultIdList(
    leagueSeasonResultIdList: string[],
  ): Promise<UserRewardModel[]> {
    return (
      await this.userRewardCoreRepository.selectUserRewardAllByLeagueSeasonResultIdList(
        leagueSeasonResultIdList,
      )
    ).map(UserRewardModel.fromPrisma);
  }

  public async createUserReward(
    input: CreateUserRewardInput,
  ): Promise<UserRewardModel> {
    return UserRewardModel.fromPrisma(
      await this.userRewardCoreRepository.insertUserReward(input),
    );
  }

  public async updateUserRewardById(
    id: string,
    input: UpdateUserRewardInput,
  ): Promise<void> {
    await this.userRewardCoreRepository.updateUserRewardById(id, input);
  }
}
