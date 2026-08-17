import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { UserRewardSeedInput } from './type/user-reward-seed.input';
import { UserRewardSeedOutput } from './type/user-reward-seed.output';

/**
 * User reward 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class UserRewardSeedHelper extends ISeedHelper<
  UserRewardSeedInput,
  UserRewardSeedOutput
> {
  public generateFilledInputValue(
    input: UserRewardSeedInput,
  ): FilledSeedInput<UserRewardSeedInput> {
    return {
      leagueSeasonResultId: input.leagueSeasonResultId,
      rewardIdx: defaultValue(input.rewardIdx, null),
      selectedAt: defaultValue(input.selectedAt, null),
      issuedAt: defaultValue(input.issuedAt, null),
    };
  }

  public async seed(input: UserRewardSeedInput): Promise<UserRewardSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const userReward = await this.prisma.userReward.create({
      select: { id: true },
      data: {
        leagueSeasonResultId: filledInput.leagueSeasonResultId,
        rewardIdx: filledInput.rewardIdx,
        selectedAt: filledInput.selectedAt,
        issuedAt: filledInput.issuedAt,
      },
    });

    return { id: userReward.id, ...filledInput };
  }
}
