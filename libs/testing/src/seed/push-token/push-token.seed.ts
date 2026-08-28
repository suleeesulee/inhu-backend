import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { PushTokenSeedInput } from '@libs/testing/seed/push-token/type/push-token-seed.input';
import { PushTokenSeedOutput } from '@libs/testing/seed/push-token/type/push-token-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

/**
 * PushToken 시드 헬퍼 클래스
 *
 * push_token_tb는 installation_tb와 1:1 관계이므로,
 * seed 전에 반드시 해당 installation이 DB에 존재해야 합니다.
 *
 * @publicApi
 */
export class PushTokenSeedHelper extends ISeedHelper<
  PushTokenSeedInput,
  PushTokenSeedOutput
> {
  public async seed(input: PushTokenSeedInput): Promise<PushTokenSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    await this.prisma.pushToken.create({
      data: {
        id: filledInput.id,
        expoPushToken: filledInput.expoPushToken,
      },
    });

    return filledInput;
  }

  public generateFilledInputValue(
    input: PushTokenSeedInput,
  ): FilledSeedInput<PushTokenSeedInput> {
    return {
      id: input.id,
      expoPushToken: defaultValue(
        input.expoPushToken,
        `ExponentPushToken[${faker.string.alphanumeric(22)}]`,
      ),
    };
  }
}
