import { NfcSeedInput } from '@libs/testing/seed/nfc/type/nfc-seed.input';
import { leagueSeasonSeedDataList } from './league-season.seed';

const activatedAt = new Date(
  leagueSeasonSeedDataList[0]!.startAt!.getTime() - 24 * 60 * 60 * 1000,
);

const nfcStateSeedDataList: NfcSeedInput[] = [
  {
    placeIdx: 1,
    score: 1,
    uid: '활성화-NFC-카페-01',
    activatedAt,
  },
  {
    placeIdx: 2,
    score: 2,
    uid: '활성화-NFC-식당-02',
    activatedAt,
  },
  {
    placeIdx: 3,
    score: 3,
    uid: '비활성화-NFC-술집-03',
    activatedAt: null,
  },
  {
    placeIdx: 4,
    score: 4,
    uid: '삭제된-NFC-카페-04',
    activatedAt,
    deletedAt: new Date(),
  },
  {
    placeIdx: 5,
    score: 5,
    uid: '활성화-NFC-식당-05',
    activatedAt,
  },
  {
    placeIdx: 6,
    score: 6,
    uid: '비활성화-NFC-카페-06',
    activatedAt: null,
  },
  {
    placeIdx: 7,
    score: 7,
    uid: '활성화-NFC-술집-07',
    activatedAt,
  },
  {
    placeIdx: 8,
    score: 8,
    uid: '활성화-NFC-식당-08',
    activatedAt,
  },
  {
    placeIdx: 9,
    score: 9,
    uid: '삭제된-NFC-카페-09',
    activatedAt,
    deletedAt: new Date(),
  },
  {
    placeIdx: 10,
    score: 10,
    uid: '활성화-NFC-카페-10',
    activatedAt,
  },
];

export const placeVisitScoreUnitList = [10, 8, 7, 5, 2, 1];

const placeVisitNfcSeedDataList: NfcSeedInput[] = Array.from(
  { length: 30 },
  (_, placeIndex) =>
    placeVisitScoreUnitList.map((score) => ({
      placeIdx: placeIndex + 11,
      score,
      uid: `방문시딩-NFC-장소-${String(placeIndex + 11).padStart(2, '0')}-점수-${String(score).padStart(2, '0')}`,
      activatedAt,
    })),
).flat();

export const nfcSeedDataList: NfcSeedInput[] = [
  ...nfcStateSeedDataList,
  ...placeVisitNfcSeedDataList,
];

export const activeNfcSeedIdxListByScore = nfcSeedDataList.reduce(
  (nfcIdxListByScore, nfc, index) => {
    if (
      !nfc.activatedAt ||
      nfc.deletedAt ||
      !placeVisitScoreUnitList.includes(nfc.score ?? 0)
    ) {
      return nfcIdxListByScore;
    }

    const score = nfc.score!;
    const nfcIdxList = nfcIdxListByScore.get(score) ?? [];
    nfcIdxList.push(index + 1);
    nfcIdxListByScore.set(score, nfcIdxList);

    return nfcIdxListByScore;
  },
  new Map<number, number[]>(),
);
