import { UserRewardCoreModule } from '@libs/core/user-reward/user-reward-core.module';
import { Module } from '@nestjs/common';
import { LeagueSeasonCoreService } from './league-season-core.service';
import { LeagueSeasonCoreRepository } from './league-season-core.repository';

@Module({
  imports: [UserRewardCoreModule],
  providers: [LeagueSeasonCoreService, LeagueSeasonCoreRepository],
  exports: [LeagueSeasonCoreService],
})
export class LeagueSeasonCoreModule {}
