import { Prisma } from '@prisma/client';
import { SELECT_CUMULATIVE_USER_RANKING } from './select-cumulative-user-ranking';

export type SelectCumulativeUserRankingCount = {
  count: number;
};

export const SELECT_CUMULATIVE_USER_RANKING_COUNT: Prisma.Sql = Prisma.sql`
  SELECT COUNT(*)::int AS "count"
  FROM (
    ${SELECT_CUMULATIVE_USER_RANKING}
  ) AS cumulative_user_ranking
`;
