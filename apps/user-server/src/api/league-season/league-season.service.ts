import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetLeagueSeasonByDateDto } from './dto/request/get-league-season-by-date.dto';
import { LeagueSeasonEntity } from './entity/league-season.entity';
import { LeagueSeasonResultEntity } from './entity/league-season-result.entity';
import { PlaceVisitCoreService } from '@libs/core/place-visit/place-visit-core.service';
import { UserRewardCoreService } from '@libs/core/user-reward/user-reward-core.service';
import { LeagueSeasonResultOverviewEntity } from './entity/league-season-result-overview.entity';
import { GetLeagueSeasonResultAllDto } from './dto/request/get-league-season-result-all.dto';
import { GetLeagueSeasonAllDto } from './dto/request/get-league-season-all.dto';
import { GetLeagueSeasonAllResponseDto } from './dto/response/get-league-season-all.response.dto';
import { LeagueSeasonOverviewEntity } from './entity/league-season-overview.entity';

@Injectable()
export class LeagueSeasonService {
  constructor(
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
    private readonly placeVisitCoreService: PlaceVisitCoreService,
    private readonly userRewardCoreService: UserRewardCoreService,
  ) {}

  public async getLeagueSeasonByDate(
    dto: GetLeagueSeasonByDateDto,
  ): Promise<LeagueSeasonEntity> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByDate(
        dto.startAt,
        dto.endAt,
        true,
      );
    if (!leagueSeason) {
      throw new NotFoundException('League season not found');
    }

    const participantCount =
      await this.placeVisitCoreService.getPlaceVisitCountByPeriod(
        dto.startAt,
        dto.endAt,
      );

    return LeagueSeasonEntity.fromModel(leagueSeason, participantCount);
  }

  public async getLeagueSeasonAll(
    dto: GetLeagueSeasonAllDto,
  ): Promise<GetLeagueSeasonAllResponseDto> {
    const pageSize = 10;
    const leagueSeasonOverviewList =
      await this.leagueSeasonCoreService.getLeagueSeasonOverviewAll({
        take: pageSize + 1,
        skip: (dto.page - 1) * pageSize,
        order: dto.order,
        activated: true,
      });

    return {
      hasNext: leagueSeasonOverviewList.length > pageSize,
      leagueSeasonOverviewList: leagueSeasonOverviewList
        .slice(0, pageSize)
        .map(LeagueSeasonOverviewEntity.fromModel),
    };
  }

  public async getLeagueSeasonResultByLeagueSeasonIdx(
    leagueSeasonIdx: number,
    userIdx: number,
  ): Promise<LeagueSeasonResultEntity> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(
        leagueSeasonIdx,
        true,
      );
    if (!leagueSeason) {
      throw new NotFoundException('League season not found');
    }

    const [
      leagueSeasonResult,
      leagueSeasonResultUserRanking,
      placeVisitStatisticList,
    ] = await Promise.all([
      this.leagueSeasonCoreService.getLeagueSeasonResultByLeagueSeasonIdxAndUserIdx(
        leagueSeasonIdx,
        userIdx,
        true,
      ),
      this.leagueSeasonCoreService.getLeagueSeasonResultUserRankingByLeagueSeasonIdxAndUserIdx(
        leagueSeasonIdx,
        userIdx,
      ),
      this.placeVisitCoreService.getPlaceVisitStatisticAllByUserIdxAndPeriod(
        userIdx,
        { startAt: leagueSeason.startAt, endAt: leagueSeason.endAt },
      ),
    ]);
    if (!leagueSeasonResult) {
      throw new NotFoundException('League-season-result not found');
    }
    if (!leagueSeasonResultUserRanking) {
      throw new NotFoundException(
        'League-season-result-user-ranking not found',
      );
    }
    if (!placeVisitStatisticList) {
      throw new NotFoundException('Place-visit-statistic list not found');
    }

    const userReward =
      await this.userRewardCoreService.getUserRewardByLeagueSeasonResultId(
        leagueSeasonResult.id,
      );
    if (!userReward) {
      throw new NotFoundException('User-reward not found');
    }

    return LeagueSeasonResultEntity.fromModel(
      leagueSeasonResult,
      leagueSeasonResultUserRanking,
      placeVisitStatisticList,
      userReward,
    );
  }

  public async getLeagueSeasonResultAll(
    userIdx: number,
    dto: GetLeagueSeasonResultAllDto,
  ): Promise<LeagueSeasonResultOverviewEntity[]> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;
    const leagueSeasonResultList =
      await this.leagueSeasonCoreService.getLeagueSeasonResultAllByUserIdx(
        userIdx,
        {
          take: pageSize,
          skip,
          order: dto.order,
          activated: true,
        },
      );

    if (leagueSeasonResultList.length === 0) {
      return [];
    }

    const leagueSeasonIdxList = leagueSeasonResultList.map(
      ({ leagueSeason }) => leagueSeason.idx,
    );
    const leagueSeasonResultIdList = leagueSeasonResultList.map(({ id }) => id);

    const [userRankingList, userRewardList] = await Promise.all([
      this.leagueSeasonCoreService.getLeagueSeasonResultUserRankingByLeagueSeasonIdxListAndUserIdx(
        leagueSeasonIdxList,
        userIdx,
      ),
      this.userRewardCoreService.getUserRewardAllByLeagueSeasonResultIdList(
        leagueSeasonResultIdList,
      ),
    ]);

    const userRankingByLeagueSeasonIdx = new Map(
      userRankingList.map((userRanking) => [
        userRanking.leagueSeasonIdx,
        userRanking,
      ]),
    );
    const userRewardByLeagueSeasonResultId = new Map(
      userRewardList.map((userReward) => [
        userReward.leagueSeasonResultId,
        userReward,
      ]),
    );

    return leagueSeasonResultList.map((leagueSeasonResult) => {
      const userRanking = userRankingByLeagueSeasonIdx.get(
        leagueSeasonResult.leagueSeason.idx,
      );
      if (!userRanking) {
        throw new NotFoundException(
          'League-season-result-user-ranking not found',
        );
      }

      const userReward = userRewardByLeagueSeasonResultId.get(
        leagueSeasonResult.id,
      );
      if (!userReward) {
        throw new NotFoundException('User-reward not found');
      }

      return LeagueSeasonResultOverviewEntity.fromModel(
        leagueSeasonResult,
        userRanking,
        userReward,
      );
    });
  }
}
