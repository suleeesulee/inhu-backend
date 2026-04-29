import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { PlaceSectionSeedInput } from './type/place-section-seed.input';
import { PlaceSectionSeedOutput } from './type/place-section.seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { faker } from '@faker-js/faker';
import { PlaceSectionParameter } from '@libs/core/place-section/place-section-parameter.type';

export class PlaceSectionSeedHelper extends ISeedHelper<
  PlaceSectionSeedInput,
  PlaceSectionSeedOutput
> {
  public generateFilledInputValue(
    input: PlaceSectionSeedInput,
  ): FilledSeedInput<PlaceSectionSeedInput> {
    return {
      title: defaultValue(input.title, faker.lorem.sentence()),
      parameter: defaultValue(input.parameter, {
        page: 1,
        order: 'desc',
        orderby: 'time',
        mainCategoryList: [],
        freeTagList: [],
      } as PlaceSectionParameter) as FilledSeedInput<PlaceSectionSeedInput>['parameter'],
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(
    input: PlaceSectionSeedInput,
  ): Promise<PlaceSectionSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);
    const placeSectionCount = await this.prisma.placeSection.count({
      where: {
        deletedAt: null,
      },
    });
    const magazineSectionCount = await this.prisma.magazineSection.count({
      where: {
        deletedAt: null,
      },
    });

    const placeSection = await this.prisma.placeSection.create({
      select: { idx: true, sortOrder: true },
      data: {
        title: filledInput.title,
        parameter: filledInput.parameter,
        sortOrder: placeSectionCount + magazineSectionCount + 1,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      idx: placeSection.idx,
      sortOrder: placeSection.sortOrder,
      ...filledInput,
    };
  }
}
