import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { LeagueSeasonSeedInput } from './type/league-season-seed.input';
import { LeagueSeasonSeedOutput } from './type/league-season-seed.output';

/**
 * League season 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class LeagueSeasonSeedHelper extends ISeedHelper<
  LeagueSeasonSeedInput,
  LeagueSeasonSeedOutput
> {
  public generateFilledInputValue(
    input: LeagueSeasonSeedInput,
  ): FilledSeedInput<LeagueSeasonSeedInput> {
    const startAt = defaultValue(input.startAt, faker.date.recent());

    return {
      name: defaultValue(input.name, faker.lorem.words(3)),
      createdAt: defaultValue(input.createdAt, new Date()),
      startAt,
      endAt: defaultValue(
        input.endAt,
        faker.date.soon({ days: 14, refDate: startAt }),
      ),
      activatedAt: defaultValue(input.activatedAt, null),
      finalizedAt: defaultValue(input.finalizedAt, null),
      rewardOptionList: defaultValue(
        input.rewardOptionList?.map((rewardOption) => ({
          rewardIdx: rewardOption.rewardIdx,
          targetRank: defaultValue(rewardOption.targetRank, 1),
          deletedAt: defaultValue(rewardOption.deletedAt, null),
        })),
        null,
      ),
    };
  }

  public async seed(
    input: LeagueSeasonSeedInput,
  ): Promise<LeagueSeasonSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const leagueSeason = await this.prisma.leagueSeason.create({
      select: { idx: true },
      data: {
        name: filledInput.name,
        createdAt: filledInput.createdAt,
        startAt: filledInput.startAt,
        endAt: filledInput.endAt,
        activatedAt: filledInput.activatedAt,
        finalizedAt: filledInput.finalizedAt,
        rewardOptionList: filledInput.rewardOptionList
          ? {
              createMany: {
                data: filledInput.rewardOptionList,
              },
            }
          : undefined,
      },
    });

    return { idx: leagueSeason.idx, ...filledInput };
  }
}
