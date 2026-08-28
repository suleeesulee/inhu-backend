import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { PlaceVisitCoreService } from '@libs/core/place-visit/place-visit-core.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeagueSeasonEntity } from './entity/league-season.entity';
import { GetLeagueSeasonAllResponseDto } from './dto/response/get-league-season-all.dto';
import { CreateLeagueSeasonDto } from './dto/request/create-league-season.dto';
import { UpdateLeagueSeasonDto } from './dto/request/update-league-season.dto';
import { GetLeagueSeasonAllDto } from './dto/request/get-league-season-all.dto';
import { LeagueSeasonOverviewEntity } from './entity/league-season-overview.entity';
import { CreateLeagueSeasonLeagueRewardOptionDto } from './dto/request/create-league-season-league-reward-option.dto';
import { UpdateLeagueSeasonLeagueRewardOptionDto } from './dto/request/update-league-season-league-reward-option.dto';

@Injectable()
export class LeagueSeasonService {
  constructor(
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
    private readonly placeVisitCoreService: PlaceVisitCoreService,
  ) {}

  public async getLeagueSeasonByIdx(idx: number): Promise<LeagueSeasonEntity> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    const participantCount =
      await this.placeVisitCoreService.getPlaceVisitParticipantCountByDatePeriod(
        leagueSeason.startAt,
        leagueSeason.endAt,
      );

    return LeagueSeasonEntity.fromModel(leagueSeason, participantCount);
  }

  public async getLeagueSeasonAll(
    dto: GetLeagueSeasonAllDto,
  ): Promise<GetLeagueSeasonAllResponseDto> {
    const pageSize = 10;
    const input = {
      take: pageSize,
      skip: (dto.page - 1) * pageSize,
      order: dto.order,
      activated: dto.activated,
    };
    const [leagueSeasonList, count] = await Promise.all([
      this.leagueSeasonCoreService.getLeagueSeasonOverviewAll(input),
      this.leagueSeasonCoreService.getLeagueSeasonOverviewCount(input),
    ]);

    return {
      count,
      leagueSeasonOverviewList: leagueSeasonList.map(
        LeagueSeasonOverviewEntity.fromModel,
      ),
    };
  }

  public async createLeagueSeason(
    dto: CreateLeagueSeasonDto,
  ): Promise<LeagueSeasonEntity> {
    this.validatePeriod(dto.startAt, dto.endAt);

    return LeagueSeasonEntity.fromModel(
      await this.leagueSeasonCoreService.createLeagueSeason({
        name: dto.name,
        startAt: dto.startAt,
        endAt: dto.endAt,
        activatedAt: null,
      }),
      0,
    );
  }

  public async createLeagueSeasonLeagueRewardOptionList(
    idx: number,
    dto: CreateLeagueSeasonLeagueRewardOptionDto,
  ): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(idx, {
      rewardOptionList: dto.rewardOptionList,
    });
  }

  public async updateLeagueSeasonLeagueRewardOptionList(
    idx: number,
    dto: UpdateLeagueSeasonLeagueRewardOptionDto,
  ): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(idx, {
      rewardOptionList: dto.rewardOptionList,
    });
  }

  public async updateLeagueSeasonByIdx(
    idx: number,
    dto: UpdateLeagueSeasonDto,
  ): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    this.validatePeriod(dto.startAt, dto.endAt);

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(idx, dto);
  }

  public async activateLeagueSeasonByIdx(idx: number): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    if (leagueSeason.activatedAt) {
      throw new ConflictException(
        `League season with idx ${idx} is already activated`,
      );
    }

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(idx, {
      activatedAt: new Date(),
    });
  }

  public async deactivateLeagueSeasonByIdx(idx: number): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    if (!leagueSeason.activatedAt) {
      throw new ConflictException(
        `League season with idx ${idx} is not activated`,
      );
    }

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(idx, {
      activatedAt: null,
    });
  }

  private validatePeriod(startAt: string, endAt: string): void {
    if (new Date(startAt).getTime() > new Date(endAt).getTime()) {
      throw new BadRequestException('Start date must not be after end date');
    }
  }
}
