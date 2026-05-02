import { Injectable } from '@nestjs/common';
import { MealOfferingModel } from './model/meal-offering.model';
import { MealOfferingCoreRepository } from './meal-offering-core.repository';
import { CreateMealOfferingInput } from './inputs/create-meal-offering.input';
import { UpdateMealOfferingInput } from './inputs/update-meal-offering.input';

@Injectable()
export class MealOfferingCoreService {
  constructor(
    private readonly mealOfferingCoreRepository: MealOfferingCoreRepository,
  ) {}

  public async getMealOfferingByIdx(
    idx: number,
  ): Promise<MealOfferingModel | null> {
    const mealOffering =
      await this.mealOfferingCoreRepository.selectMealOfferingByIdx(idx);
    return mealOffering && MealOfferingModel.fromPrisma(mealOffering);
  }

  public async getMealOfferingByFoodStationIdxAndServedDate(
    foodStationIdx: number,
    servedDate: string,
  ): Promise<MealOfferingModel | null> {
    const mealOffering =
      await this.mealOfferingCoreRepository.selectMealOfferingByFoodStationIdxAndServedDate(
        foodStationIdx,
        servedDate,
      );
    return mealOffering && MealOfferingModel.fromPrisma(mealOffering);
  }

  public async createMealOffering(
    input: CreateMealOfferingInput,
  ): Promise<MealOfferingModel> {
    return MealOfferingModel.fromPrisma(
      await this.mealOfferingCoreRepository.insertMealOffering(input),
    );
  }

  public async updateMealOfferingByIdx(
    idx: number,
    input: UpdateMealOfferingInput,
  ): Promise<void> {
    await this.mealOfferingCoreRepository.updateMealOfferingByIdx(idx, input);
  }

  public async deleteMealOfferingByIdx(idx: number): Promise<void> {
    await this.mealOfferingCoreRepository.softDeleteMealOfferingByIdx(idx);
  }
}
