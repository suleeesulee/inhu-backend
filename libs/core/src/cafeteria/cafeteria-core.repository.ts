import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_CAFETERIA,
  SelectCafeteria,
} from './model/prisma-type/select-cafeteria';
import { CreateCafeteriaInput } from './inputs/create-cafeteria.input';
import { UpdateCafeteriaInput } from './inputs/update-cafeteria.input';
import {
  SELECT_FOOD_STATION_FOR_COPY,
  SelectFoodStationForCopy,
} from './model/prisma-type/select-food-station-for-copy';

@Injectable()
export class CafeteriaCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectCafeteriaByIdx(
    idx: number,
  ): Promise<SelectCafeteria | null> {
    return await this.txHost.tx.cafeteria.findUnique({
      ...SELECT_CAFETERIA,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectCafeteriaAll(): Promise<SelectCafeteria[]> {
    return await this.txHost.tx.cafeteria.findMany({
      ...SELECT_CAFETERIA,
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
    });
  }

  public async insertCafeteria(
    input: CreateCafeteriaInput,
  ): Promise<SelectCafeteria> {
    return await this.txHost.tx.cafeteria.create({
      ...SELECT_CAFETERIA,
      data: {
        name: input.name,
      },
    });
  }

  public async updateCafeteriaByIdx(
    idx: number,
    input: UpdateCafeteriaInput,
  ): Promise<void> {
    await this.txHost.tx.cafeteria.update({
      data: {
        name: input.name,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async softDeleteCafeteriaByIdx(idx: number): Promise<void> {
    await this.txHost.tx.cafeteria.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectFoodStationsForCopy(
    fromCafeteriaIdx: number,
    startDate: string,
    endDate: string,
  ): Promise<SelectFoodStationForCopy[]> {
    return await this.txHost.tx.foodStation.findMany({
      ...SELECT_FOOD_STATION_FOR_COPY,
      select: {
        ...SELECT_FOOD_STATION_FOR_COPY.select,
        mealOfferingList: {
          select: SELECT_FOOD_STATION_FOR_COPY.select.mealOfferingList.select,
          where: {
            deletedAt: null,
            servedDate: {
              gte: `${startDate}T00:00:00Z`,
              lte: `${endDate}T00:00:00Z`,
            },
          },
        },
      },
      where: {
        cafeteriaIdx: fromCafeteriaIdx,
        deletedAt: null,
        startDate: `${startDate}T00:00:00Z`,
        endDate: `${endDate}T00:00:00Z`,
      },
    });
  }

  public async insertFoodStationsForCopy(
    toCafeteriaIdx: number,
    stations: SelectFoodStationForCopy[],
  ): Promise<void> {
    for (const station of stations) {
      await this.txHost.tx.foodStation.create({
        data: {
          cafeteriaIdx: toCafeteriaIdx,
          mealTypeIdx: station.mealTypeIdx,
          name: station.name,
          startTime: station.startTime,
          endTime: station.endTime,
          startDate: station.startDate,
          endDate: station.endDate,
          mealOfferingList: {
            create: station.mealOfferingList.map((offering) => ({
              startTime: offering.startTime,
              endTime: offering.endTime,
              kcal: offering.kcal,
              servedDate: offering.servedDate,
              mealItemList: {
                create: offering.mealItemList.map((item) => ({
                  name: item.name,
                  price: item.price,
                })),
              },
            })),
          },
        },
      });
    }
  }
}
