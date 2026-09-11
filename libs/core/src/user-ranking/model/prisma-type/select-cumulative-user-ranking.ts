import { Prisma } from '@prisma/client';

export type SelectCumulativeUserRanking = {
  userIdx: number;
  nickname: string;
  cumulativeRank: number;
  cumulativeScore: number;
  cumulativeLatestVisitAt: Date;
};

export const SELECT_CUMULATIVE_USER_RANKING: Prisma.Sql = Prisma.sql`
  WITH user_score AS (
    SELECT
      u.idx AS user_idx,
      u.nickname,
      COALESCE(SUM(pv.score), 0)::int AS cumulative_score,
      MAX(pv.created_at) AS cumulative_latest_visit_at
    FROM user_tb AS u
    LEFT JOIN place_visit_tb AS pv
      ON pv.user_idx = u.idx
      AND pv.deleted_at IS NULL
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
      cumulative_latest_visit_at,
      ROW_NUMBER() OVER (
        ORDER BY
          cumulative_score DESC,
          cumulative_latest_visit_at ASC,
          user_idx ASC
      )::int AS cumulative_rank
    FROM user_score
  )
  SELECT
    ru.user_idx AS "userIdx",
    ru.nickname AS "nickname",
    ru.cumulative_rank AS "cumulativeRank",
    ru.cumulative_score AS "cumulativeScore",
    ru.cumulative_latest_visit_at AS "cumulativeLatestVisitAt"
  FROM ranked_user AS ru
`;
