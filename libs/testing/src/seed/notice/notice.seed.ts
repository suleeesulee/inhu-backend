import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { NoticeSeedInput } from './type/notice-seed.input';
import { NoticeSeedOutput } from './type/notice-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';

/**
 * notice 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class NoticeSeedHelper extends ISeedHelper<
  NoticeSeedInput,
  NoticeSeedOutput
> {
  public generateFilledInputValue(
    input: NoticeSeedInput,
  ): FilledSeedInput<NoticeSeedInput> {
    return {
      authorIdx: input.authorIdx,
      title: defaultValue(input.title, faker.lorem.sentence()),
      content: defaultValue(input.content, faker.lorem.paragraphs()),
    };
  }

  public async seed(input: NoticeSeedInput): Promise<NoticeSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const notice = await this.prisma.notice.create({
      select: { idx: true },
      data: {
        authorIdx: filledInput.authorIdx,
        title: filledInput.title,
        content: filledInput.content,
      },
    });

    return {
      idx: notice.idx,
      ...filledInput,
    };
  }
}
