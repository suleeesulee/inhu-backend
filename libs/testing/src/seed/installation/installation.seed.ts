import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { InstallationSeedInput } from '@libs/testing/seed/installation/type/installation-seed.input';
import { InstallationSeedOutput } from '@libs/testing/seed/installation/type/installation-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

/**
 * Installation 시드 헬퍼 클래스
 * @publicApi
 */
export class InstallationSeedHelper extends ISeedHelper<
  InstallationSeedInput,
  InstallationSeedOutput
> {
  public async seed(input: InstallationSeedInput): Promise<InstallationSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    await this.prisma.installation.create({
      data: {
        id: filledInput.id,
        platform: filledInput.platform,
        appVersion: filledInput.appVersion,
        userIdx: filledInput.userIdx,
        refreshTokenExpiresAt: filledInput.refreshTokenExpiresAt,
      },
    });

    return filledInput;
  }

  public generateFilledInputValue(
    input: InstallationSeedInput,
  ): FilledSeedInput<InstallationSeedInput> {
    return {
      id: defaultValue(input.id, faker.string.uuid()),
      platform: defaultValue(input.platform, faker.helpers.arrayElement(['ios', 'android'] as const)),
      appVersion: defaultValue(input.appVersion, `${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}.${faker.number.int({ min: 0, max: 9 })}`),
      userIdx: defaultValue(input.userIdx, null),
      refreshTokenExpiresAt: defaultValue(input.refreshTokenExpiresAt, null),
    };
  }
}
