import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { SearchTagSeedInput } from './type/search-tag-seed.input';
import { SearchTagSeedOutput } from './type/search-tag-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { faker } from '@faker-js/faker';

/**
 * search-tag 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class SearchTagSeedHelper extends ISeedHelper<
  SearchTagSeedInput,
  SearchTagSeedOutput
> {
  public generateFilledInputValue(
    input: SearchTagSeedInput,
  ): FilledSeedInput<SearchTagSeedInput> {
    return {
      content: defaultValue(input.content, faker.lorem.paragraphs()),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: SearchTagSeedInput): Promise<SearchTagSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const searchTag = await this.prisma.searchTag.create({
      select: { idx: true },
      data: {
        content: filledInput.content,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      idx: searchTag.idx,
      ...filledInput,
    };
  }
}
