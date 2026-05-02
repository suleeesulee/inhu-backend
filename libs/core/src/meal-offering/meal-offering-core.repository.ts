import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_MEAL_OFFERING,
  SelectMealOffering,
} from './model/prisma-type/select-meal-offering';
import { CreateMealOfferingInput } from './inputs/create-meal-offering.input';
import { UpdateMealOfferingInput } from './inputs/update-meal-offering.input';

@Injectable()
export class MealOfferingCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectMealOfferingByIdx(
    idx: number,
  ): Promise<SelectMealOffering | null> {
    return await this.txHost.tx.mealOffering.findUnique({
      ...SELECT_MEAL_OFFERING,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectMealOfferingByFoodStationIdxAndServedDate(
    foodStationIdx: number,
    servedDate: string,
  ): Promise<SelectMealOffering | null> {
    return await this.txHost.tx.mealOffering.findFirst({
      ...SELECT_MEAL_OFFERING,
      where: {
        foodStationIdx,
        servedDate: `${servedDate}T00:00:00Z`,
        deletedAt: null,
      },
    });
  }

  public async insertMealOffering(
    input: CreateMealOfferingInput,
  ): Promise<SelectMealOffering> {
    return await this.txHost.tx.mealOffering.create({
      ...SELECT_MEAL_OFFERING,
      data: {
        foodStationIdx: input.foodStationIdx,
        startTime: `1970-01-01T${input.startTime}Z`,
        endTime: `1970-01-01T${input.endTime}Z`,
        kcal: input.kcal,
        servedDate: `${input.servedDate}T00:00:00Z`,
        mealItemList: {
          createMany: {
            data: input.mealItemList.map((mealItem) => ({
              name: mealItem.name,
              price: mealItem.price,
            })),
          },
        },
      },
    });
  }

  public async updateMealOfferingByIdx(
    idx: number,
    input: UpdateMealOfferingInput,
  ): Promise<void> {
    await this.txHost.tx.mealOffering.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        foodStationIdx: input.foodStationIdx,
        startTime: `1970-01-01T${input.startTime}Z`,
        endTime: `1970-01-01T${input.endTime}Z`,
        kcal: input.kcal,
        servedDate: `${input.servedDate}T00:00:00Z`,
        mealItemList: input.mealItemList
          ? {
              deleteMany: {},
              createMany: {
                data: input.mealItemList.map((mealItem) => ({
                  name: mealItem.name,
                  price: mealItem.price,
                })),
              },
            }
          : undefined,
      },
    });
  }

  public async softDeleteMealOfferingByIdx(idx: number): Promise<void> {
    await this.txHost.tx.mealOffering.update({
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
