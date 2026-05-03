import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { MealOfferingSeedOutput } from './type/meal-offering-seed.output';
import { MealOfferingSeedInput } from './type/meal-offering-seed.input';

/**
 * meal offering 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class MealOfferingSeedHelper extends ISeedHelper<
  MealOfferingSeedInput,
  MealOfferingSeedOutput
> {
  public generateFilledInputValue(
    input: MealOfferingSeedInput,
  ): FilledSeedInput<MealOfferingSeedInput> {
    return {
      foodStationIdx: input.foodStationIdx,
      startTime: defaultValue(input.startTime, faker.date.recent()),
      endTime: defaultValue(input.endTime, faker.date.recent()),
      kcal: defaultValue(input.kcal, null),
      servedDate: defaultValue(input.servedDate, faker.date.recent()),
      mealItemList: defaultValue(input.mealItemList, [
        {
          name: faker.word.noun({ length: { min: 1, max: 20 } }),
          price: 0,
          deletedAt: null,
        },
      ]) as { name: string; price: number; deletedAt: Date | null }[],
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(
    input: MealOfferingSeedInput,
  ): Promise<MealOfferingSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const mealOffering = await this.prisma.mealOffering.create({
      select: { idx: true },
      data: {
        foodStationIdx: filledInput.foodStationIdx,
        startTime: this.transformKoreanTime(filledInput.startTime),
        endTime: this.transformKoreanTime(filledInput.endTime),
        kcal: filledInput.kcal,
        servedDate: this.transformKoreanDate(filledInput.servedDate),
        mealItemList: filledInput.mealItemList
          ? {
              createMany: {
                data: filledInput.mealItemList.map((mealItem) => ({
                  name: mealItem.name,
                  price: mealItem.price,
                  deletedAt: mealItem.deletedAt,
                })),
              },
            }
          : undefined,
        deletedAt: filledInput.deletedAt,
      },
    });

    return { idx: mealOffering.idx, ...filledInput };
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
