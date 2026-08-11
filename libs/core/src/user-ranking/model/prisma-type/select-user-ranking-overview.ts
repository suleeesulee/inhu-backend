import { Prisma } from '@prisma/client';

export type SelectUserRankingOverview = {
  seasonRank: number | null;
  cumulativeRank: number | null;
  cumulativeScore: number;
};

export const SELECT_USER_RANKING_OVERVIEW: Prisma.Sql = Prisma.sql`
  WITH target_league_season AS (
    SELECT
      idx,
      start_at,
      end_at
    FROM league_season_tb
    WHERE start_at <= NOW()
    ORDER BY
      start_at DESC,
      idx DESC
    LIMIT 1
  ),
  user_score AS (
    SELECT
      u.idx AS user_idx,
      COALESCE(
        SUM(pv.score) FILTER (
          WHERE pv.created_at >= tls.start_at
            AND pv.created_at <= tls.end_at
        ),
        0
      )::int AS season_score,
      MAX(pv.created_at) FILTER (
        WHERE pv.created_at >= tls.start_at
          AND pv.created_at <= tls.end_at
      ) AS season_latest_visit_at,
      COALESCE(SUM(pv.score), 0)::int AS cumulative_score,
      MAX(pv.created_at) AS cumulative_latest_visit_at
    FROM user_tb AS u
    JOIN target_league_season AS tls
      ON TRUE
    LEFT JOIN place_visit_tb AS pv
      ON pv.user_idx = u.idx
    WHERE u.deleted_at IS NULL
    GROUP BY
      u.idx,
      tls.idx,
      tls.start_at,
      tls.end_at
  ),
  ranked_user AS (
    SELECT
      user_idx,
      season_score,
      season_latest_visit_at,
      cumulative_score,
      cumulative_latest_visit_at,
      CASE
        WHEN season_score = 0 THEN NULL
        ELSE ROW_NUMBER() OVER (
          ORDER BY
            season_score DESC,
            season_latest_visit_at DESC NULLS LAST,
            user_idx ASC
        )::int
      END AS season_rank,
      CASE
        WHEN cumulative_score = 0 THEN NULL
        ELSE ROW_NUMBER() OVER (
          ORDER BY
            cumulative_score DESC,
            cumulative_latest_visit_at DESC NULLS LAST,
            user_idx ASC
        )::int
      END AS cumulative_rank
    FROM user_score
  )
  SELECT
    ru.season_rank AS "seasonRank",
    ru.cumulative_rank AS "cumulativeRank",
    ru.cumulative_score AS "cumulativeScore"
  FROM ranked_user AS ru
`;
