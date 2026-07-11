import { Prisma } from '@prisma/client';
import { SELECT_USER_REWARD_LEAGUE_SEASON_RESULT } from './select-user-reward-league-season-result';

export const SELECT_USER_REWARD =
  Prisma.validator<Prisma.UserRewardDefaultArgs>()({
    select: {
      id: true,
      rewardIdx: true,
      createdAt: true,
      selectedAt: true,
      issuedAt: true,
      leagueSeasonResult: SELECT_USER_REWARD_LEAGUE_SEASON_RESULT,
    },
  });

export type SelectUserReward = Prisma.UserRewardGetPayload<
  typeof SELECT_USER_REWARD
>;
