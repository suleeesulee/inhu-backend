import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRankingCoreService } from '@libs/core/user-ranking/user-ranking-core.service';
import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { UserRewardCoreService } from '@libs/core/user-reward/user-reward-core.service';
import { RewardCoreService } from '@libs/core/reward/reward-core.service';
import { GetUserRankingAllDto } from './dto/request/get-user-ranking-all.dto';
import { GetUserRankingAllResponseDto } from './dto/response/get-user-ranking-all.response.dto';
import { UserRankingOverviewEntity } from './entity/user-ranking-overview.entity';

@Injectable()
export class UserRankingService {
  constructor(
    private readonly userRankingCoreService: UserRankingCoreService,
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
    private readonly userCoreService: UserCoreService,
    private readonly userRewardCoreService: UserRewardCoreService,
    private readonly rewardCoreService: RewardCoreService,
  ) {}

  public async getUserRankingAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
    dto: GetUserRankingAllDto,
  ): Promise<GetUserRankingAllResponseDto> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(leagueSeasonIdx);
    if (!leagueSeason) {
      throw new NotFoundException('League season not found');
    }

    const pageSize = 10;
    const [userRankingList, count, userRewardList] = await Promise.all([
      this.userRankingCoreService.getUserRankingAllByLeagueSeasonIdx(
        leagueSeasonIdx,
        {
          take: pageSize,
          skip: (dto.page - 1) * pageSize,
        },
      ),
      this.userRankingCoreService.getUserRankingCountByLeagueSeasonIdx(
        leagueSeasonIdx,
      ),
      this.userRewardCoreService.getUserRewardAll({ leagueSeasonIdx }),
    ]);

    const [userList, leagueSeasonResultList, rewardList] = await Promise.all([
      this.userCoreService.getUserAllByIdxList(
        userRankingList.map(({ userIdx }) => userIdx),
      ),
      this.leagueSeasonCoreService.getLeagueSeasonResultAllByIdList(
        userRewardList.map(({ leagueSeasonResultId }) => leagueSeasonResultId),
      ),
      this.rewardCoreService.getRewardAllByIdxList(
        userRewardList.flatMap(({ rewardIdx }) =>
          rewardIdx === null ? [] : [rewardIdx],
        ),
      ),
    ]);

    const userMap = new Map(userList.map((user) => [user.idx, user]));
    const leagueSeasonResultMap = new Map(
      leagueSeasonResultList.map((leagueSeasonResult) => [
        leagueSeasonResult.id,
        leagueSeasonResult,
      ]),
    );
    const rewardMap = new Map(rewardList.map((reward) => [reward.idx, reward]));
    const userRewardMap = new Map(
      userRewardList.map((userReward) => {
        const leagueSeasonResult = leagueSeasonResultMap.get(
          userReward.leagueSeasonResultId,
        );
        if (!leagueSeasonResult) {
          throw new NotFoundException('League season result not found');
        }

        return [leagueSeasonResult.userIdx, userReward];
      }),
    );

    return {
      count,
      userRankingList: userRankingList.map((userRanking) => {
        const user = userMap.get(userRanking.userIdx);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const userReward = userRewardMap.get(userRanking.userIdx) ?? null;
        const reward = userReward?.rewardIdx
          ? (rewardMap.get(userReward.rewardIdx) ?? null)
          : null;
        if (userReward?.rewardIdx && !reward) {
          throw new NotFoundException('Reward not found');
        }

        return UserRankingOverviewEntity.fromModel(
          userRanking,
          user,
          userReward,
          reward,
        );
      }),
    };
  }
}
