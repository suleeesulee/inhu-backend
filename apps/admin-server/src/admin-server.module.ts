import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { AdminAccessTokenMiddleware } from './common/middleware/admin-access-token.middleware';
import { PrismaModule } from '@libs/common/modules/prisma/prisma.module';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { LoginTokenModule } from './common/modules/login-token/login-token.module';
import { PlaceModule } from '@admin/api/place/place.module';
import { UserModule } from '@admin/api/user/user.module';
import { MenuModule } from './api/menu/menu.module';
import { ReviewModule } from './api/review/review.module';
import { S3UploadModule } from '@admin/api/s3-upload/s3-upload.module';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { BlogReviewModule } from '@admin/api/blog-review/blog-review.module';
import { MagazineModule } from './api/magazine/magazine.module';
import { OpenAIModule } from '@libs/common/modules/openAI/openAI.module';
import { PinnedMagazineModule } from './api/pinned-magazine/pinned-magazine.module';
import { NaverMenuModule } from '@libs/common/modules/naver-menu/naver-menu.module';
import { ServerExceptionsFilter } from '@libs/common/filters/server-exception.filter';
import { HashModule } from '@libs/common/modules/hash/hash.module';
import { FreeTagModule } from './api/free-tag/free-tag.module';
import { SearchTagModule } from './api/search-tag/search-tag.module';
import { AdminAccountModule } from './api/admin/admin-account.module';
import { SectionModule } from './api/section/section.module';
import { CafeteriaModule } from './api/cafeteria/cafeteria.module';
import { DailyMemoModule } from './api/daily-memo/daily-memo.module';
import { MealOfferingModule } from './api/meal-offering/meal-offering.module';
import { FoodStationModule } from './api/food-station/food-station.module';
import { MetricModule } from '@libs/common/modules/metric/metric.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricInterceptor } from '@libs/common/interceptors/metric.interceptor';
import { PrometheusApiModule } from './api/prometheus/prometheus.module';
import { Ga4Module } from '@libs/common/modules/ga4/ga4.module';
import { StatisticModule } from './api/statistic/statistic.module';
import { RewardModule } from './api/reward/reward.module';
import { NfcModule } from './api/nfc/nfc.module';
import { LeagueSeasonModule } from './api/league-season/league-season.module';
import { UserRewardModule } from './api/user-reward/user-reward.module';
import { NoticeModule } from './api/notice/notice.module';

@Module({
  imports: [
    AuthModule,
    LoginTokenModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
            sqlFlavor: 'postgresql',
          }),
        }),
      ],
    }),
    DiscordWebhookModule,
    PlaceModule,
    UserModule,
    MenuModule,
    ReviewModule,
    S3UploadModule,
    BlogReviewModule,
    MagazineModule,
    OpenAIModule,
    PinnedMagazineModule,
    NaverMenuModule,
    HashModule,
    FreeTagModule,
    SearchTagModule,
    AdminAccountModule,
    SectionModule,
    CafeteriaModule,
    DailyMemoModule,
    MealOfferingModule,
    FoodStationModule,
    MetricModule,
    PrometheusApiModule,
    StatisticModule,
    RewardModule,
    NfcModule,
    LeagueSeasonModule,
    UserRewardModule,
    NoticeModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: ServerExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricInterceptor,
    },
  ],
})
export class AdminServerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(AdminAccessTokenMiddleware).forRoutes('/');
  }
}
