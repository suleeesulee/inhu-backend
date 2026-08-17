import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { Module } from '@nestjs/common';
import { LeagueSeasonController } from './league-season.controller';
import { LeagueSeasonService } from './league-season.service';

@Module({
  imports: [LeagueSeasonCoreModule],
  controllers: [LeagueSeasonController],
  providers: [LeagueSeasonService],
})
export class LeagueSeasonModule {}
