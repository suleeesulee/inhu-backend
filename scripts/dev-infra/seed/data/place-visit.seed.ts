import { PlaceVisitSeedInput } from '@libs/testing/seed/place-visit/type/place-visit-seed.input';
import { leagueSeasonSeedDataList } from './league-season.seed';
import {
  getLeagueSeasonUserScore,
  leagueSeasonResultSeedDataList,
} from './league-season-result.seed';
import {
  activeNfcSeedIdxListByScore,
  placeVisitScoreUnitList,
} from './nfc.seed';
import { userSeedDataList } from './user.seed';

const getVisitDate = (
  startAt: Date,
  userIdx: number,
  visitIndex: number,
): Date =>
  new Date(
    startAt.getTime() + ((userIdx - 1) * 10 + visitIndex + 1) * 60 * 1000,
  );

const splitScore = (score: number): number[] => {
  const result: number[] = [];
  let remainder = score;

  for (const scoreUnit of placeVisitScoreUnitList) {
    while (remainder >= scoreUnit) {
      result.push(scoreUnit);
      remainder -= scoreUnit;
    }
  }

  return result;
};

const getNfcIdx = (
  score: number,
  userIdx: number,
  leagueSeasonIdx: number,
  visitIndex: number,
): number => {
  const nfcIdxList = activeNfcSeedIdxListByScore.get(score);
  if (!nfcIdxList?.length) {
    throw new Error(`Active NFC not found for score (score: ${score})`);
  }

  const nfcIndex =
    (userIdx * 7 + leagueSeasonIdx * 11 + visitIndex * 3) % nfcIdxList.length;

  return nfcIdxList[nfcIndex]!;
};

export const placeVisitSeedDataList: PlaceVisitSeedInput[] = [
  ...leagueSeasonResultSeedDataList.flatMap((leagueSeasonResult) =>
    splitScore(leagueSeasonResult.finalScore!).map((score, visitIndex) => ({
      userIdx: leagueSeasonResult.userIdx,
      nfcIdx: getNfcIdx(
        score,
        leagueSeasonResult.userIdx,
        leagueSeasonResult.leagueSeasonIdx,
        visitIndex,
      ),
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
      nfcIdx: getNfcIdx(
        visitScore,
        userIdx,
        leagueSeasonSeedDataList.length,
        visitIndex,
      ),
      score: visitScore,
      createdAt: getVisitDate(
        leagueSeasonSeedDataList[leagueSeasonSeedDataList.length - 1]!.startAt!,
        userIdx,
        visitIndex,
      ),
    }));
  }),
];
