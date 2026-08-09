import { Prisma } from '@prisma/client';
import { SELECT_LEAGUE_REWARD_OPTION } from './select-league-reward-option';

export const SELECT_LEAGUE_SEASON =
  Prisma.validator<Prisma.LeagueSeasonDefaultArgs>()({
    select: {
      idx: true,
      name: true,
      startAt: true,
      endAt: true,
      createdAt: true,
      finalizedAt: true,
      rewardOptionList: SELECT_LEAGUE_REWARD_OPTION,
    },
  });

export type SelectLeagueSeason = Prisma.LeagueSeasonGetPayload<
  typeof SELECT_LEAGUE_SEASON
>;
