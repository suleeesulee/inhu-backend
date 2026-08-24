import { LeagueSeasonSeedInput } from '@libs/testing/seed/league-season/type/league-season-seed.input';
import { activeRewardSeedIdxList } from './reward.seed';

const getStartOfMonth = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
};

const now = new Date();
const currentStartAt = getStartOfMonth(now);

const previousLeagueSeasonCount = 24;
const inactiveLeagueSeasonIndex = 5;
const notFinalizedLeagueSeasonIndex = 11;

const previousLeagueSeasonStateList = Array.from(
  { length: previousLeagueSeasonCount },
  (_, index) => ({
    name:
      index === inactiveLeagueSeasonIndex
        ? '비활성화·집계 완료'
        : index === notFinalizedLeagueSeasonIndex
          ? '종료·집계 미완료'
          : '종료·집계 완료·리그 참여 이력',
    activated: index !== inactiveLeagueSeasonIndex,
    finalized: index !== notFinalizedLeagueSeasonIndex,
  }),
);

const getRewardOptionList = (leagueSeasonIndex: number) => {
  const rewardIdxList = Array.from(
    { length: 8 },
    (_, optionIndex) =>
      activeRewardSeedIdxList[
        (leagueSeasonIndex + optionIndex) % activeRewardSeedIdxList.length
      ]!,
  );
  const fourthToTenthRewardIdx = rewardIdxList[7]!;

  return [
    ...rewardIdxList
      .slice(0, 3)
      .map((rewardIdx) => ({ rewardIdx, targetRank: 1 })),
    ...rewardIdxList
      .slice(3, 5)
      .map((rewardIdx) => ({ rewardIdx, targetRank: 2 })),
    ...rewardIdxList
      .slice(5, 7)
      .map((rewardIdx) => ({ rewardIdx, targetRank: 3 })),
    ...Array.from({ length: 7 }, (_, index) => ({
      rewardIdx: fourthToTenthRewardIdx,
      targetRank: index + 4,
    })),
  ];
};

const previousLeagueSeasonSeedDataList: LeagueSeasonSeedInput[] =
  previousLeagueSeasonStateList.map((state, index) => {
    const startAt = addMonths(
      currentStartAt,
      index - previousLeagueSeasonCount,
    );
    const endAt = new Date(startAt);
    endAt.setUTCDate(15);
    endAt.setUTCHours(23, 59, 59, 0);

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
      rewardOptionList: getRewardOptionList(index),
    };
  });

const currentLeagueSeason: LeagueSeasonSeedInput = {
  name: '개발용 현재 리그 (진행 중·활성화·미집계)',
  createdAt: new Date(currentStartAt.getTime() - 7 * 24 * 60 * 60 * 1000),
  startAt: currentStartAt,
  endAt: (() => {
    const endAt = addMonths(currentStartAt, 1);
    endAt.setUTCDate(0);
    endAt.setUTCHours(23, 59, 59, 0);
    return endAt;
  })(),
  activatedAt: new Date(currentStartAt),
  finalizedAt: null,
  rewardOptionList: getRewardOptionList(previousLeagueSeasonCount),
};

export const leagueSeasonSeedDataList: LeagueSeasonSeedInput[] = [
  ...previousLeagueSeasonSeedDataList,
  currentLeagueSeason,
];

export const leagueSeasonSeedDate = {
  currentStartAt,
  previousStartAt: addMonths(currentStartAt, -1),
};

export const rewardedLeagueSeasonIdxList = previousLeagueSeasonStateList
  .map((state, index) => ({ ...state, leagueSeasonIdx: index + 1 }))
  .filter(({ activated, finalized }) => activated && finalized)
  .map(({ leagueSeasonIdx }) => leagueSeasonIdx);
