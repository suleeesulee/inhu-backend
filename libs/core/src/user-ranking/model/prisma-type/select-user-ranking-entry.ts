import { Prisma } from '@prisma/client';

export type SelectUserRankingEntry = {
  userIdx: number;
  nickname: string;
  rank: number;
  score: number;
};

export const SELECT_CUMULATIVE_USER_RANKING: Prisma.Sql = Prisma.sql`
  WITH user_score AS (
    SELECT
      u.idx AS user_idx,
      u.nickname,
      COALESCE(SUM(pv.score), 0)::int AS score
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
      score,
      RANK() OVER (ORDER BY score DESC)::int AS rank
    FROM user_score
  )
  SELECT
    ru.user_idx AS "userIdx",
    ru.nickname AS "nickname",
    ru.rank AS "rank",
    ru.score AS "score"
  FROM ranked_user AS ru
`;

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
      COALESCE(SUM(pv.score), 0)::int AS score
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
      score,
      RANK() OVER (ORDER BY score DESC)::int AS rank
    FROM user_score
  )
  SELECT
    ru.user_idx AS "userIdx",
    ru.nickname AS "nickname",
    ru.rank AS "rank",
    ru.score AS "score"
  FROM ranked_user AS ru
`;
