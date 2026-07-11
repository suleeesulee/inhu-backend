import { Prisma } from '@prisma/client';

export const SELECT_USER_REWARD_LEAGUE_SEASON =
  Prisma.validator<Prisma.LeagueSeasonDefaultArgs>()({
    select: {
      idx: true,
      name: true,
      startAt: true,
      endAt: true,
    },
  });

export type SelectUserRewardLeagueSeason = Prisma.LeagueSeasonGetPayload<
  typeof SELECT_USER_REWARD_LEAGUE_SEASON
>;
