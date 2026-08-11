import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { UserRankingCoreService } from '@libs/core/user-ranking/user-ranking-core.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetCumulativeRankingAllDto } from './dto/request/get-ranking-all.dto';
import { GetSeasonRankingAllResponseDto } from './dto/response/get-season-ranking-all.response.dto';
import { GetCumulativeRankingAllResponseDto } from './dto/response/get-cumulative-ranking-all.response.dto';
import { CumulativeUserRankingEntity } from './entity/cumulative-user-ranking.entity';
import { SeasonUserRankingEntity } from './entity/season-user-ranking.entity';
import { UserRankingOverviewEntity } from './entity/user-ranking-overview.entity';
import { UserRankingEntity } from './entity/user-ranking.entity';
import { GetSeasonRankingAllDto } from './dto/request/get-season-ranking-all.dto';

const RANKING_CACHE_TTL_SECONDS = 30;

@Injectable()
export class UserRankingService {
  private readonly logger = new Logger(UserRankingService.name);

  constructor(
    private readonly userRankingCoreService: UserRankingCoreService,
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
  ) {}

  public async getUserRankingAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<UserRankingEntity[]> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(leagueSeasonIdx);
    if (!leagueSeason) {
      throw new NotFoundException('League season not found');
    }

    return (
      await this.userRankingCoreService.getUserRankingAllByLeagueSeasonIdx(
        leagueSeasonIdx,
      )
    ).map(UserRankingEntity.fromModel);
  }

  public async getSeasonRankingAll(
    leagueSeasonIdx: number,
    dto: GetSeasonRankingAllDto,
  ): Promise<GetSeasonRankingAllResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(leagueSeasonIdx);
    if (!leagueSeason) {
      throw new NotFoundException('League season not found');
    }

    const rankingList =
      await this.userRankingCoreService.getSeasonUserRankingAll(
        leagueSeasonIdx,
        {
          take: pageSize + 1,
          skip,
        },
      );

    return {
      hasNext: rankingList.length > pageSize,
      seasonUserRankingList: rankingList
        .slice(0, pageSize)
        .map(SeasonUserRankingEntity.fromModel),
    };
  }

  public async getCumulativeRankingAll(
    dto: GetCumulativeRankingAllDto,
  ): Promise<GetCumulativeRankingAllResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;
    const rankingList =
      await this.userRankingCoreService.getCumulativeUserRankingAll({
        take: pageSize + 1,
        skip,
      });

    return {
      hasNext: rankingList.length > pageSize,
      cumulativeUserRankingList: rankingList
        .slice(0, pageSize)
        .map(CumulativeUserRankingEntity.fromModel),
    };
  }

  public async getUserRankingOverview(
    userIdx: number,
  ): Promise<UserRankingOverviewEntity> {
    const userRanking =
      await this.userRankingCoreService.getUserRankingOverviewByUserIdx(
        userIdx,
      );
    if (!userRanking) {
      throw new NotFoundException('Latest league season or user not found');
    }

    return UserRankingOverviewEntity.fromModel(userRanking);
  }
}
