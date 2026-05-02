import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { FoodStationSeedInput } from './type/food-station-seed.input';
import { FoodStationSeedOutput } from './type/food-station-seed.output';
import { MealType } from '@libs/core/food-station/constants/meal-type.constant';
import { pickRandomValue } from '@libs/common/utils/random.util';

/**
 * food station 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class FoodStationSeedHelper extends ISeedHelper<
  FoodStationSeedInput,
  FoodStationSeedOutput
> {
  public generateFilledInputValue(
    input: FoodStationSeedInput,
  ): FilledSeedInput<FoodStationSeedInput> {
    return {
      cafeteriaIdx: input.cafeteriaIdx,
      mealType: defaultValue(input.mealType, pickRandomValue(MealType)),
      name: defaultValue(
        input.name,
        faker.word.noun({ length: { min: 5, max: 20 } }),
      ),
      startTime: defaultValue(
        input.startTime,
        faker.date.recent().toISOString(),
      ),
      endTime: defaultValue(input.endTime, faker.date.recent().toISOString()),
      startDate: defaultValue(
        input.startDate,
        faker.date.recent().toISOString(),
      ),
      endDate: defaultValue(input.endDate, faker.date.soon().toISOString()),
      mealOfferingList: defaultValue(
        input.mealOfferingList?.map((offering) => ({
          foodStationIdx: offering.foodStationIdx,
          startTime: defaultValue(
            offering.startTime,
            faker.date.recent().toISOString(),
          ),
          endTime: defaultValue(
            offering.endTime,
            faker.date.recent().toISOString(),
          ),
          kcal: defaultValue(offering.kcal, null),
          servedDate: defaultValue(
            offering.servedDate,
            faker.date.recent().toISOString(),
          ),
          mealItemList: defaultValue(
            offering.mealItemList?.map((item) => ({
              name: defaultValue(item.name, faker.word.noun()),
              price: defaultValue(item.price, 0),
              deletedAt: defaultValue(item.deletedAt, null),
            })),
            [],
          ),
          deletedAt: defaultValue(offering.deletedAt, null),
        })),
        null,
      ),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(
    input: FoodStationSeedInput,
  ): Promise<FoodStationSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const foodStation = await this.prisma.foodStation.create({
      select: { idx: true },
      data: {
        cafeteriaIdx: filledInput.cafeteriaIdx,
        mealTypeIdx: filledInput.mealType,
        name: filledInput.name,
        startTime: this.transformKoreanTime(new Date(filledInput.startTime)),
        endTime: this.transformKoreanTime(new Date(filledInput.endTime)),
        startDate: this.transformKoreanDate(new Date(filledInput.startDate)),
        endDate: this.transformKoreanDate(new Date(filledInput.endDate)),
        mealOfferingList: filledInput.mealOfferingList
          ? {
              create: filledInput.mealOfferingList.map((offering) => ({
                startTime: this.transformKoreanTime(
                  new Date(offering.startTime),
                ),
                endTime: this.transformKoreanTime(new Date(offering.endTime)),
                kcal: offering.kcal,
                servedDate: this.transformKoreanDate(
                  new Date(offering.servedDate),
                ),
                deletedAt: offering.deletedAt,
                mealItemList: {
                  createMany: {
                    data: offering.mealItemList.map((item) => ({
                      name: item.name,
                      price: item.price,
                      deletedAt: item.deletedAt,
                    })),
                  },
                },
              })),
            }
          : undefined,
        deletedAt: filledInput.deletedAt,
      },
    });

    return { idx: foodStation.idx, ...filledInput };
  }

  private transformKoreanTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `1970-01-01T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  private transformKoreanDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00Z`;
  }
}
