import { Module } from '@nestjs/common';
import { UserCdcModule } from './user-cdc/user-cdc.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CdcInterceptor } from './common/interceptors/cdc.interceptor';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { PlaceCdcModule } from './place-cdc/place-cdc.module';
import { MainCategoryCdcModule } from './main-category-cdc/main-category-cdc.module';
import { MoodCategoryCdcModule } from './mood-category-cdc/mood-category-cdc.module';
import { PlaceTypeCdcModule } from './place-type-cdc/place-type-cdc.module';

@Module({
  imports: [
    UserCdcModule,
    PlaceCdcModule,
    DiscordWebhookModule,
    MainCategoryCdcModule,
    MoodCategoryCdcModule,
    PlaceTypeCdcModule,
  ],
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
