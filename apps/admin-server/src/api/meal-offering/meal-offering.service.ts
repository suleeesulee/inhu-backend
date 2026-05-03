import { MealOfferingCoreService } from '@libs/core/meal-offering/meal-offering-core.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MealOfferingEntity } from './entity/meal-offering.entity';
import { CreateMealOfferingDto } from './dto/request/create-meal-offering.dto';
import { FoodStationCoreService } from '@libs/core/food-station/food-station-core.service';
import { UpdateMealOfferingDto } from './dto/request/update-meal-offering.dto';

@Injectable()
export class MealOfferingService {
  constructor(
    private readonly mealOfferingCoreService: MealOfferingCoreService,
    private readonly foodStationCoreService: FoodStationCoreService,
  ) {}

  public async createMealOffering(
    foodStationIdx: number,
    dto: CreateMealOfferingDto,
  ): Promise<MealOfferingEntity> {
    const foodStation =
      await this.foodStationCoreService.getFoodStationByIdx(foodStationIdx);
    if (!foodStation) {
      throw new NotFoundException('Food station not found');
    }

    const existingMealOffering =
      await this.mealOfferingCoreService.getMealOfferingByFoodStationIdxAndServedDate(
        foodStationIdx,
        dto.servedDate,
      );
    if (existingMealOffering) {
      throw new ConflictException(
        'Meal offering already exists for the served date',
      );
    }

    return MealOfferingEntity.fromModel(
      await this.mealOfferingCoreService.createMealOffering({
        foodStationIdx,
        ...dto,
      }),
    );
  }

  public async updateMealOfferingByIdx(
    idx: number,
    dto: UpdateMealOfferingDto,
  ): Promise<void> {
    const mealOffering =
      await this.mealOfferingCoreService.getMealOfferingByIdx(idx);
    if (!mealOffering) {
      throw new NotFoundException('Meal offering not found');
    }

    await this.mealOfferingCoreService.updateMealOfferingByIdx(idx, dto);
  }

  public async deleteMealOfferingByIdx(idx: number): Promise<void> {
    const mealOffering =
      await this.mealOfferingCoreService.getMealOfferingByIdx(idx);
    if (!mealOffering) {
      throw new NotFoundException('Meal offering not found');
    }

    await this.mealOfferingCoreService.deleteMealOfferingByIdx(idx);
  }
}
