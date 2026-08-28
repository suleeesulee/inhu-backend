import { UserRankingCoreModule } from '@libs/core/user-ranking/user-ranking-core.module';
import { Module } from '@nestjs/common';
import { UserRankingService } from './user-ranking.service';
import { UserRankingController } from './user-ranking.controller';
import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { UserCoreModule } from '@libs/core/user/user-core.module';
import { UserRewardCoreModule } from '@libs/core/user-reward/user-reward-core.module';
import { RewardCoreModule } from '@libs/core/reward/reward-core.module';

@Module({
  imports: [
    UserRankingCoreModule,
    LeagueSeasonCoreModule,
    UserCoreModule,
    UserRewardCoreModule,
    RewardCoreModule,
  ],
  providers: [UserRankingService],
  controllers: [UserRankingController],
})
export class UserRankingModule {}
