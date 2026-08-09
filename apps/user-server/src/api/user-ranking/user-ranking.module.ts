import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { UserRankingCoreModule } from '@libs/core/user-ranking/user-ranking-core.module';
import { Module } from '@nestjs/common';
import { UserRankingController } from './user-ranking.controller';
import { UserRankingService } from './user-ranking.service';

@Module({
  imports: [LeagueSeasonCoreModule, UserRankingCoreModule],
  controllers: [UserRankingController],
  providers: [UserRankingService],
})
export class UserRankingModule {}
