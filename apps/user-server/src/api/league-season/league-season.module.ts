import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { Module } from '@nestjs/common';
import { LeagueSeasonService } from './league-season.service';
import { LeagueSeasonController } from './league-season.controller';
import { PlaceVisitCoreModule } from '@libs/core/place-visit/place-visit-core.module';
import { UserRewardCoreModule } from '@libs/core/user-reward/user-reward-core.module';

@Module({
  imports: [LeagueSeasonCoreModule, PlaceVisitCoreModule, UserRewardCoreModule],
  controllers: [LeagueSeasonController],
  providers: [LeagueSeasonService],
})
export class LeagueSeasonModule {}
