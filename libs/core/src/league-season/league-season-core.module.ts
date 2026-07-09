import { Module } from '@nestjs/common';
import { LeagueSeasonCoreService } from './league-season-core.service';
import { LeagueSeasonCoreRepository } from './league-season-core.repository';

@Module({
  providers: [LeagueSeasonCoreService, LeagueSeasonCoreRepository],
  exports: [LeagueSeasonCoreRepository],
})
export class LeagueSeasonCoreModule {}
