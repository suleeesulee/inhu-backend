import { Prisma } from '@prisma/client';

export const SELECT_USER_REWARD =
  Prisma.validator<Prisma.UserRewardDefaultArgs>()({
    select: {
      id: true,
      rewardIdx: true,
      leagueSeasonResultId: true,
      createdAt: true,
      selectedAt: true,
      issuedAt: true,
    },
  });

export type SelectUserReward = Prisma.UserRewardGetPayload<
  typeof SELECT_USER_REWARD
>;
