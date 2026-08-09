import { Prisma } from '@prisma/client';

export type SelectUserRanking = {
  userIdx: number;
  nickname: string;
  seasonRank: number | null;
  seasonScore: number;
  cumulativeRank: number | null;
  cumulativeScore: number;
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
      COALESCE(SUM(pv.score), 0)::int AS cumulative_score
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
      cumulative_score,
      CASE
        WHEN season_score = 0 THEN NULL
        ELSE RANK() OVER (
          PARTITION BY league_season_idx
          ORDER BY season_score DESC
        )::int
      END AS season_rank,
      CASE
        WHEN cumulative_score = 0 THEN NULL
        ELSE RANK() OVER (
          PARTITION BY league_season_idx
          ORDER BY cumulative_score DESC
        )::int
      END AS cumulative_rank
    FROM user_score
  )
  SELECT
    ru.user_idx AS "userIdx",
    ru.nickname AS "nickname",
    ru.season_rank AS "seasonRank",
    ru.season_score AS "seasonScore",
    ru.cumulative_rank AS "cumulativeRank",
    ru.cumulative_score AS "cumulativeScore"
  FROM ranked_user AS ru
`;
