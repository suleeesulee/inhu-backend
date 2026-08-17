import { Prisma } from '@prisma/client';
import { SELECT_LEAGUE_SEASON } from './select-league-season';

export const SELECT_LEAGUE_SEASON_RESULT =
  Prisma.validator<Prisma.LeagueSeasonResultDefaultArgs>()({
    select: {
      id: true,
      userIdx: true,
      finalScore: true,
      createdAt: true,
      leagueSeason: {
        select: {
          ...SELECT_LEAGUE_SEASON.select,
          _count: {
            select: {
              leagueSeasonResultList: true,
            },
          },
        },
      },
    },
  });

export type SelectLeagueSeasonResult = Prisma.LeagueSeasonResultGetPayload<
  typeof SELECT_LEAGUE_SEASON_RESULT
>;
