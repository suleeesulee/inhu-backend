import { Logger, Module } from '@nestjs/common';
import { PlaceCronSchedule } from './place-cron.schedule';
import { PlaceCronService } from './place-cron.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { DateUtilModule } from '@libs/common/modules/date-util/date-util.module';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';

@Module({
  imports: [PlaceCoreModule, DateUtilModule, DiscordWebhookModule],
  providers: [PlaceCronSchedule, PlaceCronService, Logger],
})
export class PlaceCronModule {}
