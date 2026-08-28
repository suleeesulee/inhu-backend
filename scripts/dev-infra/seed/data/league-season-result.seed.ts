import { LeagueSeasonResultSeedInput } from '@libs/testing/seed/league-season/type/league-season-result-seed.input';
import { rewardedLeagueSeasonIdxList } from './league-season.seed';
import { userSeedDataList } from './user.seed';

export const getLeagueSeasonUserScore = (userIndex: number): number =>
  userIndex >= userSeedDataList.length - 2
    ? userSeedDataList.length
    : userIndex + 1;

export const leagueSeasonResultSeedDataList: LeagueSeasonResultSeedInput[] =
  rewardedLeagueSeasonIdxList.flatMap((leagueSeasonIdx) =>
    userSeedDataList.map((_, userIndex) => ({
      leagueSeasonIdx,
      userIdx: userIndex + 1,
      finalScore: getLeagueSeasonUserScore(userIndex),
    })),
  );
