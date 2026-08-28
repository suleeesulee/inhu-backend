import { Prisma } from '@prisma/client';
import { SELECT_USER_RANKING } from './select-user-ranking';

export type SelectUserRankingCount = {
  count: number;
};

export const SELECT_USER_RANKING_COUNT = (
  leagueSeasonIdx: number,
): Prisma.Sql => Prisma.sql`
  SELECT COUNT(*)::int AS "count"
  FROM (
    ${SELECT_USER_RANKING}
    WHERE ru.league_season_idx = ${leagueSeasonIdx}
  ) AS user_ranking
`;
