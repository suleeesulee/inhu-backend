import { Prisma } from '@prisma/client';

export type SelectCumulativeUserRanking = {
  userIdx: number;
  nickname: string;
  cumulativeRank: number;
  cumulativeScore: number;
};

export const SELECT_CUMULATIVE_USER_RANKING: Prisma.Sql = Prisma.sql`
  WITH user_score AS (
    SELECT
      u.idx AS user_idx,
      u.nickname,
      COALESCE(SUM(pv.score), 0)::int AS cumulative_score
    FROM user_tb AS u
    LEFT JOIN place_visit_tb AS pv
      ON pv.user_idx = u.idx
    WHERE u.deleted_at IS NULL
    GROUP BY
      u.idx,
      u.nickname
    HAVING COALESCE(SUM(pv.score), 0) > 0
  ),
  ranked_user AS (
    SELECT
      user_idx,
      nickname,
      cumulative_score,
      RANK() OVER (ORDER BY cumulative_score DESC)::int AS cumulative_rank
    FROM user_score
  )
  SELECT
    ru.user_idx AS "userIdx",
    ru.nickname AS "nickname",
    ru.cumulative_rank AS "cumulativeRank",
    ru.cumulative_score AS "cumulativeScore"
  FROM ranked_user AS ru
`;
