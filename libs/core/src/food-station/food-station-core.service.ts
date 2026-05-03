import { Injectable } from '@nestjs/common';
import { FoodStationCoreRepository } from './food-station-core.repository';
import { FoodStationModel } from './model/food-station.model';
import { GetFoodStationAllInput } from './inputs/get-food-station-all.input';
import { CreateFoodStationInput } from './inputs/create-food-station.input';
import { UpdateFoodStationInput } from './inputs/update-food-station.input';

@Injectable()
export class FoodStationCoreService {
  constructor(
    private readonly foodStationCoreRepository: FoodStationCoreRepository,
  ) {}

  public async getFoodStationByIdx(
    idx: number,
  ): Promise<FoodStationModel | null> {
    const foodStation =
      await this.foodStationCoreRepository.selectFoodStationByIdx(idx);
    return foodStation && FoodStationModel.fromPrisma(foodStation);
  }

  public async getFoodStationAll(
    input: GetFoodStationAllInput,
  ): Promise<FoodStationModel[]> {
    return (
      await this.foodStationCoreRepository.selectFoodStationAll(input)
    ).map(FoodStationModel.fromPrisma);
  }

  public async getFoodStationByCafeteriaIdxAndServedDate(
    cafeteriaIdx: number,
    servedDate: string,
  ): Promise<FoodStationModel[]> {
    return (
      await this.foodStationCoreRepository.selectFoodStationByCafeteriaIdxAndServedData(
        cafeteriaIdx,
        servedDate,
      )
    ).map(FoodStationModel.fromPrisma);
  }

  public async createFoodStation(
    input: CreateFoodStationInput,
  ): Promise<FoodStationModel> {
    return FoodStationModel.fromPrisma(
      await this.foodStationCoreRepository.insertFoodStation(input),
    );
  }

  public async updateFoodStationByIdx(
    idx: number,
    input: UpdateFoodStationInput,
  ): Promise<void> {
    await this.foodStationCoreRepository.updateFoodStationByIdx(idx, input);
  }

  public async deleteFoodStationByIdx(idx: number): Promise<void> {
    await this.foodStationCoreRepository.softDeleteFoodStationByIdx(idx);
  }
}
