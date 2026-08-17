import { Prisma } from '@prisma/client';

export const SELECT_REWARD = Prisma.validator<Prisma.RewardDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    imagePath: true,
    activatedAt: true,
    createdAt: true,
  },
});

export type SelectReward = Prisma.RewardGetPayload<typeof SELECT_REWARD>;
