import { SELECT_REWARD } from '@libs/core/reward/model/prisma-type/select-reward';
import { Prisma } from '@prisma/client';

export const SELECT_LEAGUE_REWARD_OPTION =
  Prisma.validator<Prisma.LeagueRewardOptionDefaultArgs>()({
    select: {
      id: true,
      targetRank: true,
      createdAt: true,
      reward: SELECT_REWARD,
    },
  });

export type SelectLeagueRewardOption = Prisma.LeagueRewardOptionGetPayload<
  typeof SELECT_LEAGUE_REWARD_OPTION
>;
