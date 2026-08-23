import { LeagueSeasonResultSeedInput } from '@libs/testing/seed/league-season/type/league-season-result-seed.input';
import { rewardedLeagueSeasonIdxList } from './league-season.seed';

const finalScoreListByLeagueSeason = [
  [10, 8, 7, 5],
  [5, 10, 8, 7],
  [7, 5, 10, 8],
  [8, 7, 5, 10],
  [10, 5, 8, 7],
];

export const leagueSeasonResultSeedDataList: LeagueSeasonResultSeedInput[] =
  rewardedLeagueSeasonIdxList.flatMap((leagueSeasonIdx, leagueSeasonIndex) =>
    finalScoreListByLeagueSeason[leagueSeasonIndex]!.map(
      (finalScore, userIndex) => ({
        leagueSeasonIdx,
        userIdx: userIndex + 1,
        finalScore,
      }),
    ),
  );
