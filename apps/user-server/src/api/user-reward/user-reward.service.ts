import { RewardCoreService } from '@libs/core/reward/reward-core.service';
import { UserRewardCoreService } from '@libs/core/user-reward/user-reward-core.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserRewardDto } from './dto/request/update-user-reward.dto';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { LoginUser } from '@user/common/types/LoginUser';
import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { Locker } from '@libs/common/decorator/locker.decorator';

@Injectable()
export class UserRewardService {
  constructor(
    private readonly userRewardCoreService: UserRewardCoreService,
    private readonly rewardCoreService: RewardCoreService,
    private readonly userCoreService: UserCoreService,
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
  ) {}

  @Locker({
    key: (id: string) => `user-reward:${id}:selection`,
  })
  public async updateUserRewardById(
    id: string,
    dto: UpdateUserRewardDto,
    loginUser: LoginUser,
  ): Promise<void> {
    const user = await this.userCoreService.getUserByIdx(loginUser.idx);
    if (!user?.isSchoolVerified) {
      throw new ForbiddenException('User is not school verified');
    }

    const userReward = await this.userRewardCoreService.getUserRewardById(id);
    if (!userReward) {
      throw new NotFoundException('User reward not found');
    }

    const leagueSeasonResult =
      await this.leagueSeasonCoreService.getLeagueSeasonResultByIdAndUserIdx(
        userReward.leagueSeasonResultId,
        loginUser.idx,
        true,
      );
    if (!leagueSeasonResult) {
      throw new ForbiddenException(
        'Different user cannot select reward for this league season result',
      );
    }

    if (userReward.issuedAt) {
      throw new ConflictException('Reward has already been issued');
    }
    if (userReward.selectedAt) {
      throw new ConflictException('Reward has already been selected');
    }

    const reward = await this.rewardCoreService.getRewardByIdx(dto.rewardIdx);
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    const userRanking =
      await this.leagueSeasonCoreService.getLeagueSeasonResultUserRankingByLeagueSeasonIdxAndUserIdx(
        leagueSeasonResult.leagueSeason.idx,
        loginUser.idx,
      );
    if (!userRanking) {
      throw new NotFoundException(
        'League-season-result-user-ranking not found',
      );
    }

    const rewardOptionList =
      leagueSeasonResult.leagueSeason.rewardOptionList.filter(
        (option) => option.reward.idx === dto.rewardIdx,
      );
    if (rewardOptionList.length === 0) {
      throw new ForbiddenException(
        'Reward is not available for this league season',
      );
    }
    if (
      !rewardOptionList.some(
        (option) => option.targetRank === userRanking.seasonRank,
      )
    ) {
      throw new ForbiddenException(
        "Reward is not available for the user's rank in this league season",
      );
    }

    await this.userRewardCoreService.updateUserRewardById(id, {
      rewardIdx: dto.rewardIdx,
      selectedAt: new Date(),
    });
  }
}
