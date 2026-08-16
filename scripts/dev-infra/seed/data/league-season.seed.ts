import { LeagueSeasonSeedInput } from '@libs/testing/seed/league-season/type/league-season-seed.input';

const getStartOfMonth = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
};

const now = new Date();
const currentStartAt = getStartOfMonth(now);

const previousLeagueSeasonStateList = [
  { name: '종료·집계 완료', activated: true, finalized: true },
  { name: '종료·집계 미완료', activated: true, finalized: false },
  { name: '비활성화·집계 완료', activated: false, finalized: true },
  { name: '비활성화·집계 미완료', activated: false, finalized: false },
  { name: '종료·집계 완료·보상 없음', activated: true, finalized: true },
  { name: '비활성화·집계 완료·보상 일부', activated: false, finalized: true },
  { name: '종료·집계 미완료·보상 없음', activated: true, finalized: false },
  { name: '종료·집계 완료·보상 선택 가능', activated: true, finalized: true },
  { name: '직전 종료·집계 완료', activated: true, finalized: true },
];

const previousLeagueSeasonSeedDataList: LeagueSeasonSeedInput[] =
  previousLeagueSeasonStateList.map((state, index) => {
    const startAt = addMonths(currentStartAt, index - 9);
    const endAt = new Date(startAt);
    endAt.setUTCDate(15);
    endAt.setUTCHours(23, 59, 59, 999);

    const finalizedAt = state.finalized ? new Date(endAt) : null;
    finalizedAt?.setUTCDate(finalizedAt.getUTCDate() + 1);
    finalizedAt?.setUTCHours(0, 0, 0, 0);

    return {
      name: `개발용 과거 리그 ${index + 1} (${state.name})`,
      createdAt: new Date(startAt.getTime() - 7 * 24 * 60 * 60 * 1000),
      startAt,
      endAt,
      activatedAt: state.activated ? new Date(startAt) : null,
      finalizedAt,
      rewardOptionList: state.name.includes('보상 없음')
        ? null
        : [
            {
              rewardIdx: [1, 2, 4, 7, 8, 10][(index + 1) % 6],
              targetRank: 1,
            },
            {
              rewardIdx: [1, 2, 4, 7, 8, 10][(index + 2) % 6],
              targetRank: 2,
            },
          ],
    };
  });

const currentLeagueSeason: LeagueSeasonSeedInput = {
  name: '개발용 현재 리그 (진행 중·활성화·미집계)',
  createdAt: new Date(currentStartAt.getTime() - 7 * 24 * 60 * 60 * 1000),
  startAt: currentStartAt,
  endAt: (() => {
    const endAt = addMonths(currentStartAt, 1);
    endAt.setUTCDate(0);
    endAt.setUTCHours(23, 59, 59, 999);
    return endAt;
  })(),
  activatedAt: new Date(currentStartAt),
  finalizedAt: null,
  rewardOptionList: [
    { rewardIdx: 1, targetRank: 1 },
    { rewardIdx: 4, targetRank: 2 },
  ],
};

export const leagueSeasonSeedDataList: LeagueSeasonSeedInput[] = [
  ...previousLeagueSeasonSeedDataList,
  currentLeagueSeason,
];

export const leagueSeasonSeedDate = {
  currentStartAt,
  previousStartAt: addMonths(currentStartAt, -1),
};
