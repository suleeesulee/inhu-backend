import { Prisma } from '@prisma/client';

export type SelectUserRanking = {
  userIdx: number;
  nickname: string;
  seasonRank: number | null;
  seasonScore: number;
  seasonLatestVisitAt: Date | null;
  cumulativeRank: number | null;
  cumulativeScore: number;
  cumulativeLatestVisitAt: Date | null;
};

export const SELECT_USER_RANKING: Prisma.Sql = Prisma.sql`
  WITH user_score AS (
    SELECT
      ls.idx AS league_season_idx,
      u.idx AS user_idx,
      u.nickname,
      COALESCE(
        SUM(pv.score) FILTER (
          WHERE pv.created_at >= ls.start_at
            AND pv.created_at <= ls.end_at
        ),
        0
      )::int AS season_score,
      MAX(pv.created_at) FILTER (
        WHERE pv.created_at >= ls.start_at
          AND pv.created_at <= ls.end_at
      ) AS season_latest_visit_at,
      COALESCE(SUM(pv.score), 0)::int AS cumulative_score,
      MAX(pv.created_at) AS cumulative_latest_visit_at
    FROM league_season_tb AS ls
    CROSS JOIN user_tb AS u
    LEFT JOIN place_visit_tb AS pv
      ON pv.user_idx = u.idx
    WHERE u.deleted_at IS NULL
    GROUP BY
      ls.idx,
      ls.start_at,
      ls.end_at,
      u.idx,
      u.nickname
  ),
  ranked_user AS (
    SELECT
      league_season_idx,
      user_idx,
      nickname,
      season_score,
      season_latest_visit_at,
      cumulative_score,
      cumulative_latest_visit_at,
      CASE
        WHEN season_score = 0 THEN NULL
        ELSE ROW_NUMBER() OVER (
          PARTITION BY league_season_idx
          ORDER BY
            season_score DESC,
            season_latest_visit_at DESC NULLS LAST,
            user_idx ASC
        )::int
      END AS season_rank,
      CASE
        WHEN cumulative_score = 0 THEN NULL
        ELSE ROW_NUMBER() OVER (
          PARTITION BY league_season_idx
          ORDER BY
            cumulative_score DESC,
            cumulative_latest_visit_at DESC NULLS LAST,
            user_idx ASC
        )::int
      END AS cumulative_rank
    FROM user_score
  )
  SELECT
    ru.user_idx AS "userIdx",
    ru.nickname AS "nickname",
    ru.season_rank AS "seasonRank",
    ru.season_score AS "seasonScore",
    ru.season_latest_visit_at AS "seasonLatestVisitAt",
    ru.cumulative_rank AS "cumulativeRank",
    ru.cumulative_score AS "cumulativeScore",
    ru.cumulative_latest_visit_at AS "cumulativeLatestVisitAt"
  FROM ranked_user AS ru
`;
