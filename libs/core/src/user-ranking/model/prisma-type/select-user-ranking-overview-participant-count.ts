import { Prisma } from '@prisma/client';
import { SELECT_USER_RANKING_OVERVIEW } from './select-user-ranking-overview';

export type SelectUserRankingOverviewParticipantCount = {
  seasonRankingParticipantCount: number;
  cumulativeRankingParticipantCount: number;
};

export const SELECT_USER_RANKING_OVERVIEW_PARTICIPANT_COUNT: Prisma.Sql = Prisma.sql`
    SELECT
      COUNT(*) FILTER (
        WHERE user_ranking."seasonRank" IS NOT NULL
      )::int AS "seasonRankingParticipantCount",
      COUNT(*) FILTER (
        WHERE user_ranking."cumulativeRank" IS NOT NULL
      )::int AS "cumulativeRankingParticipantCount"
    FROM (
      ${SELECT_USER_RANKING_OVERVIEW}
    ) AS user_ranking
  `;
