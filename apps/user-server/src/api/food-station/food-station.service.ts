import { DailyMemoCoreService } from '@libs/core/daily-memo/daily-memo-core.service';
import { FoodStationCoreService } from '@libs/core/food-station/food-station-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetFoodStationDto } from './dto/request/get-food-station.dto';
import { CafeteriaCoreService } from '@libs/core/cafeteria/cafeteria-core.service';
import { GetFoodStationResponseDto } from './dto/response/get-food-station.response.dto';
import { DailyMemoEntity } from './entity/daily-memo.entity';
import { FoodStationEntity } from './entity/food-station.entity';

@Injectable()
export class FoodStationService {
  constructor(
    private readonly foodStationCoreService: FoodStationCoreService,
    private readonly dailyMemoCoreService: DailyMemoCoreService,
    private readonly cafeteriaCoreService: CafeteriaCoreService,
  ) {}

  public async getFoodStation(
    cafeteriaIdx: number,
    dto: GetFoodStationDto,
  ): Promise<GetFoodStationResponseDto> {
    const cafeteria =
      await this.cafeteriaCoreService.getCafeteriaByIdx(cafeteriaIdx);
    if (!cafeteria) {
      throw new NotFoundException('cafeteria not found');
    }

    const foodStationList =
      await this.foodStationCoreService.getFoodStationByCafeteriaIdxAndServedDate(
        cafeteriaIdx,
        dto.servedDate,
      );
    const dailyMemo =
      await this.dailyMemoCoreService.getDailyMemoByCafeteriaIdxAndDate(
        cafeteriaIdx,
        dto.servedDate,
      );

    return {
      foodStationList: foodStationList.map(FoodStationEntity.fromModel),
      dailyMemo: dailyMemo && DailyMemoEntity.fromModel(dailyMemo),
    };
  }
}
