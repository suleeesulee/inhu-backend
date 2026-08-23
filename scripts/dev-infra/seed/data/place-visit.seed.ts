import { PlaceVisitSeedInput } from '@libs/testing/seed/place-visit/type/place-visit-seed.input';
import { leagueSeasonSeedDataList } from './league-season.seed';
import { leagueSeasonResultSeedDataList } from './league-season-result.seed';

const getVisitDate = (startAt: Date, day: number): Date => {
  const visitDate = new Date(startAt);
  visitDate.setUTCDate(day);
  visitDate.setUTCHours(10, 0, 0, 0);
  return visitDate;
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
  ...leagueSeasonResultSeedDataList.map((leagueSeasonResult) => ({
    userIdx: leagueSeasonResult.userIdx,
    nfcIdx: nfcIdxByScore.get(leagueSeasonResult.finalScore!)!,
    score: leagueSeasonResult.finalScore,
    createdAt: getVisitDate(
      leagueSeasonSeedDataList[leagueSeasonResult.leagueSeasonIdx - 1]!
        .startAt!,
      leagueSeasonResult.userIdx + 2,
    ),
  })),
  {
    userIdx: 1,
    nfcIdx: 1,
    score: 1,
    createdAt: getVisitDate(
      leagueSeasonSeedDataList[leagueSeasonSeedDataList.length - 1]!.startAt!,
      3,
    ),
  },
  {
    userIdx: 2,
    nfcIdx: 2,
    score: 2,
    createdAt: getVisitDate(
      leagueSeasonSeedDataList[leagueSeasonSeedDataList.length - 1]!.startAt!,
      4,
    ),
  },
  {
    userIdx: 3,
    nfcIdx: 5,
    score: 5,
    createdAt: getVisitDate(
      leagueSeasonSeedDataList[leagueSeasonSeedDataList.length - 1]!.startAt!,
      5,
    ),
  },
  {
    userIdx: 4,
    nfcIdx: 7,
    score: 7,
    createdAt: getVisitDate(
      leagueSeasonSeedDataList[leagueSeasonSeedDataList.length - 1]!.startAt!,
      6,
    ),
  },
];
