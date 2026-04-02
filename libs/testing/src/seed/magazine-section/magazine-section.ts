import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { MagazineSectionSeedInput } from './type/magazine-section-seed.input';
import { MagazineSectionSeedOutput } from './type/magazine-section.seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { faker } from '@faker-js/faker';
import { MagazineSectionParameter } from '@libs/core/magazine-section/magazine-section-parameter.type';

export class MagazineSectionSeedHelper extends ISeedHelper<
  MagazineSectionSeedInput,
  MagazineSectionSeedOutput
> {
  public generateFilledInputValue(
    input: MagazineSectionSeedInput,
  ): FilledSeedInput<MagazineSectionSeedInput> {
    return {
      title: defaultValue(input.title, faker.lorem.sentence()),
      parameter: defaultValue(input.parameter, {
        page: 1,
        orderBy: 'time',
        type: undefined,
        mainCategoryList: [],
        moodCategoryList: [],
      } as MagazineSectionParameter) as FilledSeedInput<MagazineSectionSeedInput>['parameter'],
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(
    input: MagazineSectionSeedInput,
  ): Promise<MagazineSectionSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const magazineSection = await this.prisma.magazineSection.create({
      select: { idx: true },
      data: {
        title: filledInput.title,
        parameter: filledInput.parameter,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      idx: magazineSection.idx,
      ...filledInput,
    };
  }
}
