import { FoodStationCoreService } from '@libs/core/food-station/food-station-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FoodStationEntity } from './entity/food-station.entity';
import { GetFoodStationAllDto } from './dto/request/get-food-station-all.dto';
import { CafeteriaCoreService } from '@libs/core/cafeteria/cafeteria-core.service';
import { GetFoodStationAllResponseDto } from './dto/response/get-food-station-all.response.dto';
import { CreateFoodStationDto } from './dto/request/create-food-station.dto';
import { UpdateFoodStationDto } from './dto/request/update-food-station.dto';

@Injectable()
export class FoodStationService {
  constructor(
    private readonly foodStationCoreService: FoodStationCoreService,
    private readonly cafeteriaCoreService: CafeteriaCoreService,
  ) {}

  public async getFoodStationAll(
    cafeteriaIdx: number,
    dto: GetFoodStationAllDto,
  ): Promise<GetFoodStationAllResponseDto> {
    const cafeteria =
      await this.cafeteriaCoreService.getCafeteriaByIdx(cafeteriaIdx);
    if (!cafeteria) {
      throw new NotFoundException('cafeteria not found');
    }

    return {
      foodStationList: (
        await this.foodStationCoreService.getFoodStationAll({
          cafeteriaIdx,
          ...dto,
        })
      ).map(FoodStationEntity.fromModel),
    };
  }

  public async createFoodStation(
    cafeteriaIdx: number,
    dto: CreateFoodStationDto,
  ): Promise<FoodStationEntity> {
    const cafeteria =
      await this.cafeteriaCoreService.getCafeteriaByIdx(cafeteriaIdx);
    if (!cafeteria) {
      throw new NotFoundException('cafeteria not found');
    }

    return FoodStationEntity.fromModel(
      await this.foodStationCoreService.createFoodStation({
        cafeteriaIdx,
        ...dto,
      }),
    );
  }

  public async updateFoodStationByIdx(
    idx: number,
    dto: UpdateFoodStationDto,
  ): Promise<void> {
    const foodStation =
      await this.foodStationCoreService.getFoodStationByIdx(idx);
    if (!foodStation) {
      throw new NotFoundException('food station not found');
    }

    await this.foodStationCoreService.updateFoodStationByIdx(idx, dto);
  }

  public async deleteFoodStationByIdx(idx: number): Promise<void> {
    const foodStation =
      await this.foodStationCoreService.getFoodStationByIdx(idx);
    if (!foodStation) {
      throw new NotFoundException('food station not found');
    }

    await this.foodStationCoreService.deleteFoodStationByIdx(idx);
  }
}
