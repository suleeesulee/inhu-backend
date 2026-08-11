import { Prisma } from '@prisma/client';

export type SelectSeasonUserRanking = {
  userIdx: number;
  nickname: string;
  seasonRank: number;
  seasonScore: number;
  seasonLatestVisitAt: Date;
};

export const SELECT_SEASON_USER_RANKING = (
  leagueSeasonIdx: number,
): Prisma.Sql => Prisma.sql`
  WITH target_league_season AS (
    SELECT
      idx,
      start_at,
      end_at
    FROM league_season_tb
    WHERE idx = ${leagueSeasonIdx}
  ),
  user_score AS (
    SELECT
      u.idx AS user_idx,
      u.nickname,
      tls.idx AS league_season_idx,
      COALESCE(SUM(pv.score), 0)::int AS season_score,
      MAX(pv.created_at) AS season_latest_visit_at
    FROM user_tb AS u
    JOIN target_league_season AS tls
      ON TRUE
    LEFT JOIN place_visit_tb AS pv
      ON pv.user_idx = u.idx
      AND pv.created_at >= tls.start_at
      AND pv.created_at <= tls.end_at
    WHERE u.deleted_at IS NULL
    GROUP BY
      u.idx,
      u.nickname,
      tls.idx
    HAVING COALESCE(SUM(pv.score), 0) > 0
  ),
  ranked_user AS (
    SELECT
      user_idx,
      nickname,
      league_season_idx,
      season_score,
      season_latest_visit_at,
      ROW_NUMBER() OVER (
        ORDER BY
          season_score DESC,
          season_latest_visit_at DESC,
          user_idx ASC
      )::int AS season_rank
    FROM user_score
  )
  SELECT
    ru.user_idx AS "userIdx",
    ru.nickname AS "nickname",
    ru.season_rank AS "seasonRank",
    ru.season_score AS "seasonScore",
    ru.season_latest_visit_at AS "seasonLatestVisitAt"
  FROM ranked_user AS ru
`;
