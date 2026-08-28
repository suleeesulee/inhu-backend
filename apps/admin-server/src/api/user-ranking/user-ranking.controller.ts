import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserRankingService } from './user-ranking.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetUserRankingAllDto } from './dto/request/get-user-ranking-all.dto';
import { GetUserRankingAllResponseDto } from './dto/response/get-user-ranking-all.response.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller()
export class UserRankingController {
  constructor(private readonly userRankingService: UserRankingService) {}

  /**
   * 특정 리그 시즌 사용자 랭킹 조회
   */
  @Get('league-season/:leagueSeasonIdx/user-ranking')
  @AdminAuth()
  @Exception(400, 'Invalid league season idx')
  @Exception(400, 'Invalid request data')
  @Exception(404, 'League season not found')
  public async getUserRankingAllByLeagueSeasonIdx(
    @Param('leagueSeasonIdx', ParseIntPipe) leagueSeasonIdx: number,
    @Query() dto: GetUserRankingAllDto,
  ): Promise<GetUserRankingAllResponseDto> {
    return await this.userRankingService.getUserRankingAllByLeagueSeasonIdx(
      leagueSeasonIdx,
      dto,
    );
  }
}
