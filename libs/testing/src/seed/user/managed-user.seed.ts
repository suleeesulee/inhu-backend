import { faker } from '@faker-js/faker';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { ManagedUserSeedInput } from './type/managed-user-seed.input';
import { ManagedUserSeedOutput } from './type/managed-user-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { defaultValue } from '@libs/common/utils/default-value.util';

/**
 * managed 유저 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class ManagedUserSeedHelper extends ISeedHelper<
  ManagedUserSeedInput,
  ManagedUserSeedOutput
> {
  public async seed(
    input: ManagedUserSeedInput,
  ): Promise<ManagedUserSeedOutput> {
    const requiredInput = this.generateFilledInputValue(input);

    const createdUser = await this.prisma.user.create({
      select: { idx: true },
      data: {
        nickname: requiredInput.nickname,
        profileImagePath: requiredInput.profileImagePath,
        deletedAt: requiredInput.deletedAt,
      },
    });

    return { idx: createdUser.idx, ...requiredInput };
  }

  public generateFilledInputValue(
    input: ManagedUserSeedInput,
  ): FilledSeedInput<ManagedUserSeedInput> {
    return {
      nickname: defaultValue(
        input.nickname,
        faker.word.noun({
          length: {
            min: 2,
            max: 8,
          },
        }),
      ),
      profileImagePath: defaultValue(
        input.profileImagePath,
        `/user-profile/${faker.string.uuid()}.png`,
      ),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }
}
