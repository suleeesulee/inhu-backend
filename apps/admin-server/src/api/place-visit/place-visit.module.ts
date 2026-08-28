import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { PlaceVisitCoreModule } from '@libs/core/place-visit/place-visit-core.module';
import { UserRewardCoreModule } from '@libs/core/user-reward/user-reward-core.module';
import { Module } from '@nestjs/common';
import { PlaceVisitController } from './place-visit.controller';
import { PlaceVisitService } from './place-visit.service';

@Module({
  imports: [PlaceVisitCoreModule, LeagueSeasonCoreModule, UserRewardCoreModule],
  controllers: [PlaceVisitController],
  providers: [PlaceVisitService],
})
export class PlaceVisitModule {}
