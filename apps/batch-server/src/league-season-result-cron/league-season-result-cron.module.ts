import { Logger, Module } from '@nestjs/common';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { PlaceVisitCoreModule } from '@libs/core/place-visit/place-visit-core.module';
import { LeagueSeasonResultCronSchedule } from './league-season-result-cron.schedule';
import { LeagueSeasonResultCronService } from './league-season-result-cron.service';

@Module({
  imports: [
    LeagueSeasonCoreModule,
    PlaceVisitCoreModule,
    DiscordWebhookModule,
  ],
  providers: [LeagueSeasonResultCronSchedule, LeagueSeasonResultCronService, Logger],
})
export class LeagueSeasonResultCronModule {}
