import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { Module } from '@nestjs/common';
import { LeagueSeasonService } from './league-season.service';
import { LeagueSeasonController } from './league-season.controller';

@Module({
  imports: [LeagueSeasonCoreModule],
  controllers: [LeagueSeasonController],
  providers: [LeagueSeasonService],
})
export class LeagueSeasonModule {}
