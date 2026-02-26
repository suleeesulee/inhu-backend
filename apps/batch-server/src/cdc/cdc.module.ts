import { Module } from '@nestjs/common';
import { UserCdcModule } from './user-cdc/user-cdc.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CdcInterceptor } from './common/interceptors/cdc.interceptor';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { PlaceCdcModule } from './place-cdc/place-cdc.module';
import { MainCategoryCdcModule } from './main-category-cdc/main-category-cdc.module';
import { MoodCategoryCdcModule } from './mood-category-cdc/mood-category-cdc.module';
import { PlaceTypeCdcModule } from './place-type-cdc/place-type-cdc.module';
import { KeywordCdcModule } from './keyword-cdc/keyword-cdc.module';
import { MagazineCdcModule } from './magazine-cdc/magazine-cdc.module';
import { MenuCdcModule } from './menu-cdc/menu-cdc.module';
import { PinnedMagazineCdcModule } from './pinned-magazine-cdc/pinned-magazine-cdc.module';
import { ReviewCdcModule } from './review-cdc/review-cdc.module';

@Module({
  imports: [
    UserCdcModule,
    PlaceCdcModule,
    DiscordWebhookModule,
    MainCategoryCdcModule,
    MoodCategoryCdcModule,
    PlaceTypeCdcModule,
    KeywordCdcModule,
    MagazineCdcModule,
    MenuCdcModule,
    PinnedMagazineCdcModule,
    ReviewCdcModule,
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
