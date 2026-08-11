import { Prisma } from '@prisma/client';

export type SelectLeagueSeasonResultUserRanking = {
  leagueSeasonIdx: number;
  userIdx: number;
  nickname: string;
  seasonRank: number;
  seasonScore: number;
  seasonLatestVisitAt: Date;
  cumulativeRank: number;
  cumulativeScore: number;
  cumulativeLatestVisitAt: Date;
};

export const SELECT_LEAGUE_SEASON_RESULT_USER_RANKING = (
  leagueSeasonIdxList: number[],
  userIdx?: number,
): Prisma.Sql => Prisma.sql`
  WITH target_league_season AS (
    SELECT
      idx,
      start_at,
      end_at
    FROM league_season_tb
    WHERE idx IN (${Prisma.join(leagueSeasonIdxList)})
      AND finalized_at IS NOT NULL
  ),
  season_user_score AS (
    SELECT
      tls.idx AS league_season_idx,
      lsr.user_idx,
      u.nickname,
      lsr.final_score AS season_score,
      MAX(pv.created_at) AS season_latest_visit_at
    FROM league_season_result_tb AS lsr
    JOIN target_league_season AS tls
      ON tls.idx = lsr.league_season_idx
    JOIN user_tb AS u
      ON u.idx = lsr.user_idx
    JOIN place_visit_tb AS pv
      ON pv.user_idx = lsr.user_idx
      AND pv.created_at >= tls.start_at
      AND pv.created_at <= tls.end_at
    GROUP BY
      tls.idx,
      lsr.user_idx,
      u.nickname,
      lsr.final_score
  ),
  season_ranked_user AS (
    SELECT
      league_season_idx,
      user_idx,
      nickname,
      season_score,
      season_latest_visit_at,
      ROW_NUMBER() OVER (
        PARTITION BY league_season_idx
        ORDER BY
          season_score DESC,
          season_latest_visit_at DESC NULLS LAST,
          user_idx ASC
      )::int AS season_rank
    FROM season_user_score
  ),
  cumulative_league_season_result AS (
    SELECT
      tls.idx AS target_league_season_idx,
      lsr.user_idx,
      lsr.final_score,
      ls.start_at,
      ls.end_at
    FROM target_league_season AS tls
    JOIN league_season_tb AS ls
      ON ls.end_at <= tls.end_at
      AND ls.finalized_at IS NOT NULL
    JOIN league_season_result_tb AS lsr
      ON lsr.league_season_idx = ls.idx
  ),
  cumulative_user_score AS (
    SELECT
      target_league_season_idx,
      user_idx,
      SUM(final_score)::int AS cumulative_score
    FROM cumulative_league_season_result
    GROUP BY
      target_league_season_idx,
      user_idx
  ),
  cumulative_user_latest_visit AS (
    SELECT
      clsr.target_league_season_idx,
      clsr.user_idx,
      MAX(pv.created_at) AS cumulative_latest_visit_at
    FROM cumulative_league_season_result AS clsr
    JOIN place_visit_tb AS pv
      ON pv.user_idx = clsr.user_idx
      AND pv.created_at >= clsr.start_at
      AND pv.created_at <= clsr.end_at
    GROUP BY
      clsr.target_league_season_idx,
      clsr.user_idx
  ),
  cumulative_ranked_user AS (
    SELECT
      cus.target_league_season_idx,
      cus.user_idx,
      cus.cumulative_score,
      culv.cumulative_latest_visit_at,
      ROW_NUMBER() OVER (
        PARTITION BY cus.target_league_season_idx
        ORDER BY
          cus.cumulative_score DESC,
          culv.cumulative_latest_visit_at DESC NULLS LAST,
          cus.user_idx ASC
      )::int AS cumulative_rank
    FROM cumulative_user_score AS cus
    JOIN cumulative_user_latest_visit AS culv
      ON culv.target_league_season_idx = cus.target_league_season_idx
      AND culv.user_idx = cus.user_idx
  )
  SELECT
    sru.league_season_idx AS "leagueSeasonIdx",
    sru.user_idx AS "userIdx",
    sru.nickname AS "nickname",
    sru.season_rank AS "seasonRank",
    sru.season_score AS "seasonScore",
    sru.season_latest_visit_at AS "seasonLatestVisitAt",
    cru.cumulative_rank AS "cumulativeRank",
    cru.cumulative_score AS "cumulativeScore",
    cru.cumulative_latest_visit_at AS "cumulativeLatestVisitAt"
  FROM season_ranked_user AS sru
  JOIN cumulative_ranked_user AS cru
    ON cru.target_league_season_idx = sru.league_season_idx
    AND cru.user_idx = sru.user_idx
  ${
    userIdx === undefined
      ? Prisma.empty
      : Prisma.sql`WHERE sru.user_idx = ${userIdx}`
  }
  ORDER BY
    sru.league_season_idx ASC,
    sru.season_rank ASC
`;
