import { UserRewardSeedInput } from '@libs/testing/seed/user-reward/type/user-reward-seed.input';
import { leagueSeasonSeedDataList } from './league-season.seed';
import { leagueSeasonResultSeedDataList } from './league-season-result.seed';

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

export const userRewardSeedDataList = (
  leagueSeasonResultIdList: string[],
): UserRewardSeedInput[] =>
  leagueSeasonResultIdList.flatMap((leagueSeasonResultId, index) => {
    const leagueSeasonResult = leagueSeasonResultSeedDataList[index]!;
    const leagueSeason =
      leagueSeasonSeedDataList[leagueSeasonResult.leagueSeasonIdx - 1]!;
    const sameLeagueSeasonResultList = leagueSeasonResultSeedDataList
      .filter(
        (result) =>
          result.leagueSeasonIdx === leagueSeasonResult.leagueSeasonIdx,
      )
      .sort((a, b) => b.finalScore! - a.finalScore!);
    const rank =
      sameLeagueSeasonResultList.findIndex(
        (result) => result.userIdx === leagueSeasonResult.userIdx,
      ) + 1;
    const rewardOption = leagueSeason.rewardOptionList!.find(
      (rewardOption) => rewardOption.targetRank === rank,
    );
    if (!rewardOption) {
      return [];
    }

    const status = index % 3;
    const selectedAt =
      status === 0 ? null : addDays(leagueSeason.finalizedAt!, (rank % 3) + 1);

    return [
      {
        leagueSeasonResultId,
        rewardIdx: selectedAt ? rewardOption.rewardIdx : null,
        selectedAt,
        issuedAt: status === 2 ? addDays(selectedAt!, 1) : null,
      },
    ];
  });
