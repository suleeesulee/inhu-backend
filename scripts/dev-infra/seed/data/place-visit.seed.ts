import { PlaceVisitSeedInput } from '@libs/testing/seed/place-visit/type/place-visit-seed.input';
import { leagueSeasonSeedDataList } from './league-season.seed';
import {
  getLeagueSeasonUserScore,
  leagueSeasonResultSeedDataList,
} from './league-season-result.seed';
import { userSeedDataList } from './user.seed';

const getVisitDate = (
  startAt: Date,
  userIdx: number,
  visitIndex: number,
): Date =>
  new Date(
    startAt.getTime() + ((userIdx - 1) * 10 + visitIndex + 1) * 60 * 1000,
  );

const scoreUnitList = [10, 8, 7, 5, 2, 1];

const splitScore = (score: number): number[] => {
  const result: number[] = [];
  let remainder = score;

  for (const scoreUnit of scoreUnitList) {
    while (remainder >= scoreUnit) {
      result.push(scoreUnit);
      remainder -= scoreUnit;
    }
  }

  return result;
};

const nfcIdxByScore = new Map([
  [1, 1],
  [2, 2],
  [5, 5],
  [7, 7],
  [8, 8],
  [10, 10],
]);

export const placeVisitSeedDataList: PlaceVisitSeedInput[] = [
  ...leagueSeasonResultSeedDataList.flatMap((leagueSeasonResult) =>
    splitScore(leagueSeasonResult.finalScore!).map((score, visitIndex) => ({
      userIdx: leagueSeasonResult.userIdx,
      nfcIdx: nfcIdxByScore.get(score)!,
      score,
      createdAt: getVisitDate(
        leagueSeasonSeedDataList[leagueSeasonResult.leagueSeasonIdx - 1]!
          .startAt!,
        leagueSeasonResult.userIdx,
        visitIndex,
      ),
    })),
  ),
  ...userSeedDataList.flatMap((_, userIndex) => {
    const userIdx = userIndex + 1;
    const score = getLeagueSeasonUserScore(userIndex);

    return splitScore(score).map((visitScore, visitIndex) => ({
      userIdx,
      nfcIdx: nfcIdxByScore.get(visitScore)!,
      score: visitScore,
      createdAt: getVisitDate(
        leagueSeasonSeedDataList[leagueSeasonSeedDataList.length - 1]!.startAt!,
        userIdx,
        visitIndex,
      ),
    }));
  }),
];
