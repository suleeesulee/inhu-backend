import { UserRewardSeedInput } from '@libs/testing/seed/user-reward/type/user-reward-seed.input';

const getDateBefore = (days: number): Date => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
};

export const userRewardSeedDataList = (
  leagueSeasonResultId: string,
): UserRewardSeedInput[] => [
  {
    leagueSeasonResultId,
    rewardIdx: 7,
    selectedAt: getDateBefore(1),
    issuedAt: null,
  },
  {
    leagueSeasonResultId,
    rewardIdx: null,
    selectedAt: null,
    issuedAt: null,
  },
  {
    leagueSeasonResultId,
    rewardIdx: 8,
    selectedAt: getDateBefore(8),
    issuedAt: getDateBefore(7),
  },
  {
    leagueSeasonResultId,
    rewardIdx: 7,
    selectedAt: getDateBefore(2),
    issuedAt: null,
  },
  {
    leagueSeasonResultId,
    rewardIdx: null,
    selectedAt: null,
    issuedAt: null,
  },
  {
    leagueSeasonResultId,
    rewardIdx: 8,
    selectedAt: getDateBefore(12),
    issuedAt: getDateBefore(10),
  },
  {
    leagueSeasonResultId,
    rewardIdx: 7,
    selectedAt: getDateBefore(3),
    issuedAt: null,
  },
  {
    leagueSeasonResultId,
    rewardIdx: null,
    selectedAt: null,
    issuedAt: null,
  },
  {
    leagueSeasonResultId,
    rewardIdx: 8,
    selectedAt: getDateBefore(20),
    issuedAt: getDateBefore(19),
  },
  {
    leagueSeasonResultId,
    rewardIdx: 7,
    selectedAt: getDateBefore(5),
    issuedAt: null,
  },
];
