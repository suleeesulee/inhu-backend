import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import { LeagueSeasonService } from './league-season.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetLeagueSeasonAllResponseDto } from './dto/response/get-league-season-all.dto';
import { LeagueSeasonEntity } from './entity/league-season.entity';
import { CreateLeagueSeasonDto } from './dto/request/create-league-season.dto';
import { UpdateLeagueSeasonDto } from './dto/request/update-league-season.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { GetLeagueSeasonAllDto } from './dto/request/get-league-season-all.dto';

@Controller('league-season')
export class LeagueSeasonController {
  constructor(private readonly leagueSeasonService: LeagueSeasonService) {}

  /**
   * 리그 시즌 전체 조회
   */
  @Get('/all')
  @AdminAuth()
  public async getLeagueSeasonAll(
    @Query() dto: GetLeagueSeasonAllDto,
  ): Promise<GetLeagueSeasonAllResponseDto> {
    return await this.leagueSeasonService.getLeagueSeasonAll(dto);
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
   * 특정 리그 시즌 수정
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
