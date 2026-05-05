import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_FOOD_STATION,
  SelectFoodStation,
} from './model/prisma-type/select-food-station';
import { SELECT_MEAL_OFFERING } from '@libs/core/meal-offering/model/prisma-type/select-meal-offering';
import { GetFoodStationAllInput } from './inputs/get-food-station-all.input';
import { CreateFoodStationInput } from './inputs/create-food-station.input';
import { UpdateFoodStationInput } from './inputs/update-food-station.input';

@Injectable()
export class FoodStationCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectFoodStationByIdx(
    idx: number,
  ): Promise<SelectFoodStation | null> {
    return await this.txHost.tx.foodStation.findUnique({
      ...SELECT_FOOD_STATION,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectFoodStationAll(
    input: GetFoodStationAllInput,
  ): Promise<SelectFoodStation[]> {
    return await this.txHost.tx.foodStation.findMany({
      ...SELECT_FOOD_STATION,
      where: {
        cafeteriaIdx: input.cafeteriaIdx,
        startDate: `${input.startDate}T00:00:00Z`,
        endDate: `${input.endDate}T00:00:00Z`,
        deletedAt: null,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  public async selectFoodStationByCafeteriaIdxAndServedData(
    cafeteriaIdx: number,
    servedDate: string,
  ): Promise<SelectFoodStation[]> {
    return await this.txHost.tx.foodStation.findMany({
      select: {
        ...SELECT_FOOD_STATION.select,
        mealOfferingList: {
          select: SELECT_MEAL_OFFERING.select,
          where: {
            deletedAt: null,
            servedDate: `${servedDate}T00:00:00Z`,
          },
        },
      },
      where: {
        cafeteriaIdx,
        deletedAt: null,
        mealOfferingList: {
          some: {
            servedDate: `${servedDate}T00:00:00Z`,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    }) as SelectFoodStation[];
  }

  public async insertFoodStation(
    input: CreateFoodStationInput,
  ): Promise<SelectFoodStation> {
    return await this.txHost.tx.foodStation.create({
      ...SELECT_FOOD_STATION,
      data: {
        cafeteriaIdx: input.cafeteriaIdx,
        mealTypeIdx: input.mealType,
        name: input.name,
        startTime: `1970-01-01T${input.startTime}Z`,
        endTime: `1970-01-01T${input.endTime}Z`,
        startDate: `${input.startDate}T00:00:00Z`,
        endDate: `${input.endDate}T23:59:59Z`,
      },
    });
  }

  public async updateFoodStationByIdx(
    idx: number,
    input: UpdateFoodStationInput,
  ): Promise<void> {
    await this.txHost.tx.foodStation.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        mealTypeIdx: input.mealType,
        name: input.name,
        startTime: input.startTime
          ? `1970-01-01T${input.startTime}Z`
          : undefined,
        endTime: input.endTime ? `1970-01-01T${input.endTime}Z` : undefined,
        startDate: input.startDate ? `${input.startDate}T00:00:00Z` : undefined,
        endDate: input.endDate ? `${input.endDate}T23:59:59Z` : undefined,
      },
    });
  }

  public async softDeleteFoodStationByIdx(idx: number): Promise<void> {
    await this.txHost.tx.foodStation.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }
}
