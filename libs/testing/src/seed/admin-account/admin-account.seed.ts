import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { AdminAccountSeedInput } from './type/admin-account-seed.input';
import { AdminAccountSeedOutput } from './type/admin-account-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { faker } from '@faker-js/faker';
import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { pickRandomValue } from '@libs/common/utils/random.util';
import { hash } from 'bcrypt';

/**
 * AdminAccount 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class AdminAccountSeedHelper extends ISeedHelper<
  AdminAccountSeedInput,
  AdminAccountSeedOutput
> {
  public generateFilledInputValue(
    input: AdminAccountSeedInput,
  ): FilledSeedInput<AdminAccountSeedInput> {
    return {
      userIdx: input.userIdx,
      id: defaultValue(
        input.id,
        faker.word.noun({ length: { min: 5, max: 20 } }),
      ),
      pw: defaultValue(input.pw, faker.internet.password({ length: 8 })),
      role: defaultValue(input.role, pickRandomValue(AdminRole)),
    };
  }

  public async seed(
    input: AdminAccountSeedInput,
  ): Promise<AdminAccountSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const hashedPw = await hash(filledInput.pw, 10);

    const adminAccount = await this.prisma.adminAccount.create({
      data: {
        idx: filledInput.userIdx,
        id: filledInput.id,
        pw: hashedPw,
        role: filledInput.role,
      },
    });

    return { ...adminAccount, ...filledInput };
  }
}
