import { UserRewardSeedInput } from '@libs/testing/seed/user-reward/type/user-reward-seed.input';

export const userRewardSeedDataList = (
  leagueSeasonResultId: string,
): UserRewardSeedInput[] => [
  {
    leagueSeasonResultId,
    rewardIdx: null,
    selectedAt: null,
    issuedAt: null,
  },
];
