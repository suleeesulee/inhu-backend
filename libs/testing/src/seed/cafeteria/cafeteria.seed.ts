import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { faker } from '@faker-js/faker';
import { CafeteriaSeedInput } from './type/cafeteria-seed.input';
import { CafeteriaSeedOutput } from './type/cafeteria-seed.output';

/**
 * cafeteria 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class CafeteriaSeedHelper extends ISeedHelper<
  CafeteriaSeedInput,
  CafeteriaSeedOutput
> {
  public generateFilledInputValue(
    input: CafeteriaSeedInput,
  ): FilledSeedInput<CafeteriaSeedInput> {
    return {
      name: defaultValue(input.name, faker.lorem.paragraphs()),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: CafeteriaSeedInput): Promise<CafeteriaSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const cafeteria = await this.prisma.cafeteria.create({
      select: { idx: true },
      data: {
        name: filledInput.name,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      idx: cafeteria.idx,
      ...filledInput,
    };
  }
}
