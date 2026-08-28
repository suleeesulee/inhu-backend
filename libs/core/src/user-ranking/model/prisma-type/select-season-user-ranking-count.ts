import { Prisma } from '@prisma/client';
import { SELECT_SEASON_USER_RANKING } from './select-season-user-ranking';

export type SelectSeasonUserRankingCount = {
  count: number;
};

export const SELECT_SEASON_USER_RANKING_COUNT = (
  leagueSeasonIdx: number,
): Prisma.Sql => Prisma.sql`
  SELECT COUNT(*)::int AS "count"
  FROM (
    ${SELECT_SEASON_USER_RANKING(leagueSeasonIdx)}
  ) AS season_user_ranking
`;
