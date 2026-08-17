import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { RewardSeedInput } from './type/reward-seed.input';
import { RewardSeedOutput } from './type/reward-seed.output';

/**
 * Reward 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class RewardSeedHelper extends ISeedHelper<
  RewardSeedInput,
  RewardSeedOutput
> {
  public generateFilledInputValue(
    input: RewardSeedInput,
  ): FilledSeedInput<RewardSeedInput> {
    return {
      name: defaultValue(input.name, faker.commerce.productName()),
      imagePath: defaultValue(input.imagePath, null),
      activatedAt: defaultValue(input.activatedAt, null),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: RewardSeedInput): Promise<RewardSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const reward = await this.prisma.reward.create({
      select: { idx: true },
      data: {
        name: filledInput.name,
        imagePath: filledInput.imagePath,
        activatedAt: filledInput.activatedAt,
        deletedAt: filledInput.deletedAt,
      },
    });

    return { idx: reward.idx, ...filledInput };
  }
}
