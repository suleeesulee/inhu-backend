import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { PlaceVisitCoreModule } from '@libs/core/place-visit/place-visit-core.module';
import { Module } from '@nestjs/common';
import { LeagueSeasonController } from './league-season.controller';
import { LeagueSeasonService } from './league-season.service';

@Module({
  imports: [LeagueSeasonCoreModule, PlaceVisitCoreModule],
  controllers: [LeagueSeasonController],
  providers: [LeagueSeasonService],
})
export class LeagueSeasonModule {}
