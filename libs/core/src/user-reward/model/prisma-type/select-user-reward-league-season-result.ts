import { Prisma } from '@prisma/client';
import { SELECT_USER_REWARD_LEAGUE_SEASON } from './select-user-reward-league-season';

export const SELECT_USER_REWARD_LEAGUE_SEASON_RESULT =
  Prisma.validator<Prisma.LeagueSeasonResultDefaultArgs>()({
    select: {
      id: true,
      leagueSeasonIdx: true,
      userIdx: true,
      finalScore: true,
      leagueSeason: SELECT_USER_REWARD_LEAGUE_SEASON,
    },
  });

export type SelectUserRewardLeagueSeasonResult =
  Prisma.LeagueSeasonResultGetPayload<
    typeof SELECT_USER_REWARD_LEAGUE_SEASON_RESULT
  >;
