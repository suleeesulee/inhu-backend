import { Prisma } from '@prisma/client';

export const SELECT_LEAGUE_SEASON_OVERVIEW =
  Prisma.validator<Prisma.LeagueSeasonDefaultArgs>()({
    select: {
      idx: true,
      name: true,
      startAt: true,
      endAt: true,
      activatedAt: true,
      createdAt: true,
    },
  });

export type SelectLeagueSeasonOverview = Prisma.LeagueSeasonGetPayload<
  typeof SELECT_LEAGUE_SEASON_OVERVIEW
>;
