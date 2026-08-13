import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LeagueSeasonService } from './league-season.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetLeagueSeasonAllResponseDto } from './dto/response/get-league-season-all.dto';
import { LeagueSeasonEntity } from './entity/league-season.entity';
import { CreateLeagueSeasonDto } from './dto/request/create-league-season.dto';
import { UpdateLeagueRewardOptionDto } from './dto/request/update-league-reward-option.dto';
import { UpdateLeagueSeasonDto } from './dto/request/update-league-season.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('league-season')
export class LeagueSeasonController {
  constructor(private readonly leagueSeasonService: LeagueSeasonService) {}

  /**
   * 리그 시즌 전체 조회
   */
  @Get('/all')
  @AdminAuth()
  public async getLeagueSeasonAll(): Promise<GetLeagueSeasonAllResponseDto> {
    return await this.leagueSeasonService.getLeagueSeasonAll();
  }

  /**
   * 특정 리그 시즌 조회
   */
  @Get('/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid league season idx')
  @Exception(404, 'League season not found')
  public async getLeagueSeasonByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<LeagueSeasonEntity> {
    return await this.leagueSeasonService.getLeagueSeasonByIdx(idx);
  }

  /**
   * 리그 시즌 생성
   */
  @Post()
  @AdminAuth()
  @Exception(400, 'Invalid request data')
  public async createLeagueSeason(
    @Body() dto: CreateLeagueSeasonDto,
  ): Promise<LeagueSeasonEntity> {
    return await this.leagueSeasonService.createLeagueSeason(dto);
  }

  /**
   * 특정 리그 시즌 보상 옵션 수정 (임시 api; 기획 논의 필요)
   */
  @Post('/:idx/reward-option')
  @AdminAuth()
  @Exception(400, 'Invalid request data')
  @Exception(404, 'League season not found')
  public async updateLeagueSeasonRewardOptionByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateLeagueRewardOptionDto,
  ): Promise<void> {
    return await this.leagueSeasonService.updateLeagueSeasonRewardOptionByIdx(
      idx,
      dto,
    );
  }

  /**
   * 특정 리그 시즌 수정 (임시 api; 기획 논의 필요)
   */
  @Put('/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid request data')
  @Exception(404, 'League season not found')
  public async updateLeagueSeasonByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateLeagueSeasonDto,
  ): Promise<void> {
    return await this.leagueSeasonService.updateLeagueSeasonByIdx(idx, dto);
  }

  /**
   * 특정 리그 시즌 활성화
   */
  @Post('/:idx/activate')
  @AdminAuth()
  @Exception(400, 'Invalid league season idx')
  @Exception(404, 'League season not found')
  @Exception(409, 'League season already activated')
  @HttpCode(200)
  public async activateLeagueSeasonByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.leagueSeasonService.activateLeagueSeasonByIdx(idx);
  }

  /**
   * 특정 리그 시즌 비활성화
   */
  @Post('/:idx/deactivate')
  @AdminAuth()
  @Exception(400, 'Invalid league season idx')
  @Exception(404, 'League season not found')
  @Exception(409, 'League season not activated')
  @HttpCode(200)
  public async deactivateLeagueSeasonByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.leagueSeasonService.deactivateLeagueSeasonByIdx(idx);
  }
}
