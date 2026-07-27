import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FreeTagSeedInput } from './type/free-tag-seed.input';
import { FreeTagSeedOutput } from './type/free-tag-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { faker } from '@faker-js/faker';

/**
 * free-tag 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class FreeTagSeedHelper extends ISeedHelper<
  FreeTagSeedInput,
  FreeTagSeedOutput
> {
  public generateFilledInputValue(
    input: FreeTagSeedInput,
  ): FilledSeedInput<FreeTagSeedInput> {
    return {
      content: defaultValue(input.content, faker.lorem.paragraphs()),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: FreeTagSeedInput): Promise<FreeTagSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const freeTag = await this.prisma.freeTag.create({
      select: { idx: true },
      data: {
        content: filledInput.content,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      idx: freeTag.idx,
      ...filledInput,
    };
  }
}
