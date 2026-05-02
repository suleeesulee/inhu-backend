import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import {
  getRandomValues,
  pickRandomValue,
} from '@libs/common/utils/random.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { DailyMemoSeedInput } from './type/daily-memo-seed.input';
import { DailyMemoSeedOutput } from './type/daily-memo-seed.output';

/**
 * daily memo 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class DailyMemoSeedHelper extends ISeedHelper<
  DailyMemoSeedInput,
  DailyMemoSeedOutput
> {
  public generateFilledInputValue(
    input: DailyMemoSeedInput,
  ): FilledSeedInput<DailyMemoSeedInput> {
    return {
      cafeteriaIdx: input.cafeteriaIdx,
      content: defaultValue(
        input.content,
        faker.lorem.paragraphs({ min: 1, max: 50 }),
      ),
      date: defaultValue(input.date, faker.date.recent()),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: DailyMemoSeedInput): Promise<DailyMemoSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const dailyMemo = await this.prisma.dailyMemo.create({
      select: { idx: true },
      data: {
        cafeteriaIdx: filledInput.cafeteriaIdx,
        content: filledInput.content,
        date: this.transformKoreanDate(filledInput.date),
        deletedAt: filledInput.deletedAt,
      },
    });

    return { idx: dailyMemo.idx, ...filledInput };
  }

  private transformKoreanDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00Z`;
  }
}
