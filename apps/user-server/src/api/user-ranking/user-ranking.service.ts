import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { UserRankingCoreService } from '@libs/core/user-ranking/user-ranking-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetCumulativeRankingAllDto } from './dto/request/get-ranking-all.dto';
import { GetSeasonRankingAllResponseDto } from './dto/response/get-season-ranking-all.response.dto';
import { GetCumulativeRankingAllResponseDto } from './dto/response/get-cumulative-ranking-all.response.dto';
import { CumulativeUserRankingEntity } from './entity/cumulative-user-ranking.entity';
import { SeasonUserRankingEntity } from './entity/season-user-ranking.entity';
import { UserRankingOverviewEntity } from './entity/user-ranking-overview.entity';
import { GetSeasonRankingAllDto } from './dto/request/get-season-ranking-all.dto';

@Injectable()
export class UserRankingService {
  constructor(
    private readonly userRankingCoreService: UserRankingCoreService,
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
  ) {}

  public async getSeasonRankingAll(
    leagueSeasonIdx: number,
    dto: GetSeasonRankingAllDto,
  ): Promise<GetSeasonRankingAllResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(
        leagueSeasonIdx,
        true,
      );
    if (!leagueSeason) {
      throw new NotFoundException('League season not found');
    }

    const [rankingList, seasonRankingParticipantCount] = await Promise.all([
      this.userRankingCoreService.getSeasonUserRankingAll(leagueSeasonIdx, {
        take: pageSize + 1,
        skip,
      }),
      this.userRankingCoreService.getSeasonUserRankingCountByLeagueSeasonIdx(
        leagueSeasonIdx,
      ),
    ]);

    return {
      hasNext: rankingList.length > pageSize,
      seasonUserRankingList: rankingList
        .slice(0, pageSize)
        .map((ranking) =>
          SeasonUserRankingEntity.fromModel(
            ranking,
            seasonRankingParticipantCount,
          ),
        ),
    };
  }

  public async getCumulativeRankingAll(
    dto: GetCumulativeRankingAllDto,
  ): Promise<GetCumulativeRankingAllResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;
    const [rankingList, cumulativeRankingParticipantCount] = await Promise.all([
      this.userRankingCoreService.getCumulativeUserRankingAll({
        take: pageSize + 1,
        skip,
      }),
      this.userRankingCoreService.getCumulativeUserRankingCount(),
    ]);

    return {
      hasNext: rankingList.length > pageSize,
      cumulativeUserRankingList: rankingList
        .slice(0, pageSize)
        .map((ranking) =>
          CumulativeUserRankingEntity.fromModel(
            ranking,
            cumulativeRankingParticipantCount,
          ),
        ),
    };
  }

  public async getUserRankingOverview(
    userIdx: number,
  ): Promise<UserRankingOverviewEntity> {
    const [userRanking, participantCount] = await Promise.all([
      this.userRankingCoreService.getUserRankingOverviewByUserIdx(userIdx),
      this.userRankingCoreService.getUserRankingOverviewParticipantCount(),
    ]);
    if (!userRanking) {
      throw new NotFoundException('Latest league season or user not found');
    }

    return UserRankingOverviewEntity.fromModel(
      userRanking,
      participantCount.seasonRankingParticipantCount,
      participantCount.cumulativeRankingParticipantCount,
    );
  }
}
