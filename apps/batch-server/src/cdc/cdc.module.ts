import { Module } from '@nestjs/common';
import { UserCdcModule } from './user-cdc/user-cdc.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CdcInterceptor } from './common/interceptors/cdc.interceptor';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { PlaceCdcModule } from './place-cdc/place-cdc.module';

@Module({
  imports: [UserCdcModule, PlaceCdcModule, DiscordWebhookModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CdcInterceptor,
    },
  ],
  exports: [],
})
export class CdcModule {}
