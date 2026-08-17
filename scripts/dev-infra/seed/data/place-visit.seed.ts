import { PlaceVisitSeedInput } from '@libs/testing/seed/place-visit/type/place-visit-seed.input';
import { leagueSeasonSeedDate } from './league-season.seed';

const getVisitDate = (startAt: Date, day: number): Date => {
  const visitDate = new Date(startAt);
  visitDate.setUTCDate(day);
  visitDate.setUTCHours(10, 0, 0, 0);
  return visitDate;
};

export const placeVisitSeedDataList: PlaceVisitSeedInput[] = Array.from(
  { length: 10 },
  (_, index) => ({
    userIdx: (index % 2) + 1,
    nfcIdx: index + 1,
    score: index + 1,
    createdAt:
      index < 5
        ? getVisitDate(leagueSeasonSeedDate.previousStartAt, index + 1)
        : getVisitDate(leagueSeasonSeedDate.currentStartAt, index - 4),
  }),
);
