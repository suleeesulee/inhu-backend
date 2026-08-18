import { Locker } from '@libs/common/decorator/locker.decorator';
import { MailService } from '@libs/common/modules/mail/mail.service';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { UserRewardCoreService } from '@libs/core/user-reward/user-reward-core.service';
import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { RewardCoreService } from '@libs/core/reward/reward-core.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetUserRewardAllDto } from './dto/request/get-user-reward-all.dto';
import { GetUserRewardAllResponseDto } from './dto/response/get-user-reward-all.response.dto';
import { UserRewardOverviewEntity } from './entity/user-reward-overview.entity';
import { UserRewardEntity } from './entity/user-reward.entity';

@Injectable()
export class UserRewardService {
  constructor(
    private readonly userRewardCoreService: UserRewardCoreService,
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
    private readonly userCoreService: UserCoreService,
    private readonly rewardCoreService: RewardCoreService,
    private readonly mailService: MailService,
  ) {}

  public async getUserRewardAll(
    dto: GetUserRewardAllDto,
  ): Promise<GetUserRewardAllResponseDto> {
    const pageSize = 10;
    const userRewardList = await this.userRewardCoreService.getUserRewardAll({
      take: pageSize + 1,
      skip: (dto.page - 1) * pageSize,
      status: dto.status,
      order: dto.order,
      leagueSeasonIdx: dto.leagueSeasonIdx,
    });
    const pagedUserRewardList = userRewardList.slice(0, pageSize);
    const leagueSeasonResultList =
      await this.leagueSeasonCoreService.getLeagueSeasonResultAllByIdList(
        pagedUserRewardList.map(
          (userReward) => userReward.leagueSeasonResultId,
        ),
      );
    const leagueSeasonResultMap = new Map(
      leagueSeasonResultList.map((leagueSeasonResult) => [
        leagueSeasonResult.id,
        leagueSeasonResult,
      ]),
    );
    const [userList, rewardList] = await Promise.all([
      this.userCoreService.getUserAllByIdxList(
        leagueSeasonResultList.map(
          (leagueSeasonResult) => leagueSeasonResult.userIdx,
        ),
      ),
      this.rewardCoreService.getRewardAllByIdxList(
        pagedUserRewardList.flatMap((userReward) =>
          userReward.rewardIdx === null ? [] : [userReward.rewardIdx],
        ),
      ),
    ]);
    const userMap = new Map(userList.map((user) => [user.idx, user]));
    const rewardMap = new Map(rewardList.map((reward) => [reward.idx, reward]));

    return {
      hasNext: userRewardList.length > pageSize,
      userRewardList: pagedUserRewardList.map((userReward) => {
        const leagueSeasonResult = leagueSeasonResultMap.get(
          userReward.leagueSeasonResultId,
        );
        if (!leagueSeasonResult) {
          throw new NotFoundException('League season result not found');
        }

        const user = userMap.get(leagueSeasonResult.userIdx);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const reward = userReward.rewardIdx
          ? (rewardMap.get(userReward.rewardIdx) ?? null)
          : null;
        if (userReward.rewardIdx && !reward) {
          throw new NotFoundException('Reward not found');
        }

        return UserRewardOverviewEntity.fromModel(
          userReward,
          leagueSeasonResult,
          user,
          reward,
        );
      }),
    };
  }

  public async getUserRewardById(id: string): Promise<UserRewardEntity> {
    const userReward = await this.userRewardCoreService.getUserRewardById(id);
    if (!userReward) {
      throw new NotFoundException('User reward not found');
    }

    const leagueSeasonResult =
      await this.leagueSeasonCoreService.getLeagueSeasonResultById(
        userReward.leagueSeasonResultId,
      );
    if (!leagueSeasonResult) {
      throw new NotFoundException('League season result not found');
    }

    const [user, reward] = await Promise.all([
      this.userCoreService.getUserByIdx(leagueSeasonResult.userIdx),
      userReward.rewardIdx
        ? this.rewardCoreService.getRewardByIdx(userReward.rewardIdx)
        : null,
    ]);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (userReward.rewardIdx && !reward) {
      throw new NotFoundException('Reward not found');
    }

    return UserRewardEntity.fromModel(
      userReward,
      leagueSeasonResult,
      user,
      reward,
    );
  }

  @Locker({
    key: (id: string) => `user-reward:${id}:issuance`,
  })
  public async issueUserRewardById(id: string): Promise<void> {
    const userReward = await this.userRewardCoreService.getUserRewardById(id);
    if (!userReward) {
      throw new NotFoundException('User reward not found');
    }
    if (userReward.issuedAt) {
      throw new ConflictException('User reward has already been issued');
    }
    if (!userReward.selectedAt || !userReward.rewardIdx) {
      throw new ConflictException('User has not selected a reward');
    }

    const leagueSeasonResult =
      await this.leagueSeasonCoreService.getLeagueSeasonResultById(
        userReward.leagueSeasonResultId,
      );
    if (!leagueSeasonResult) {
      throw new NotFoundException('League season result not found');
    }

    const [user, reward] = await Promise.all([
      this.userCoreService.getUserByIdx(leagueSeasonResult.userIdx),
      this.rewardCoreService.getRewardByIdx(userReward.rewardIdx),
    ]);
    if (!user?.schoolEmail) {
      throw new ForbiddenException('User school email not found');
    }
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    await this.mailService.sendMail(
      user.schoolEmail,
      `[인후] ${leagueSeasonResult.leagueSeason.name} 리워드 발급 안내`,
      `<p>${user.nickname}님의 리워드가 발급되었습니다.</p><p>리워드: ${reward.name}</p>`,
    );
    await this.userRewardCoreService.updateUserRewardById(id, {
      issuedAt: new Date(),
    });
  }
}
