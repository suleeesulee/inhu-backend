import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { LeagueSeasonResultSeedInput } from './type/league-season-result-seed.input';
import { LeagueSeasonResultSeedOutput } from './type/league-season-result-seed.output';

/**
 * League season result 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class LeagueSeasonResultSeedHelper extends ISeedHelper<
  LeagueSeasonResultSeedInput,
  LeagueSeasonResultSeedOutput
> {
  public generateFilledInputValue(
    input: LeagueSeasonResultSeedInput,
  ): FilledSeedInput<LeagueSeasonResultSeedInput> {
    return {
      leagueSeasonIdx: input.leagueSeasonIdx,
      userIdx: input.userIdx,
      finalScore: defaultValue(input.finalScore, 0),
    };
  }

  public async seed(
    input: LeagueSeasonResultSeedInput,
  ): Promise<LeagueSeasonResultSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const leagueSeasonResult = await this.prisma.leagueSeasonResult.create({
      select: { id: true },
      data: {
        leagueSeasonIdx: filledInput.leagueSeasonIdx,
        userIdx: filledInput.userIdx,
        finalScore: filledInput.finalScore,
      },
    });

    return { id: leagueSeasonResult.id, ...filledInput };
  }
}
