import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from '../../../libs/common/src/modules/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { ConfigModule } from '@nestjs/config';
import { ReviewModule } from './api/review/review.module';
import { PickedPlaceModule } from './api/picked-place/picked-place.module';
import { ClsModule } from 'nestjs-cls';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { AuthModule } from '@user/api/auth/auth.module';
import { LoginTokenModule } from '@user/common/module/login-token/login-token.module';
import { AccessTokenMiddleware } from '@user/common/middleware/access-token.middleware';
import { UserModule } from './api/user/user.module';
import { MenuModule } from '@user/api/menu/menu.module';
import { S3UploadModule } from './api/s3-upload/s3-upload.module';
import { BookmarkModule } from './api/bookmark/bookmark.module';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { RedlockModule } from '@libs/common/modules/redlock/redlock.module';
import { AopModule } from '@toss/nestjs-aop';
import { BlogReviewModule } from '@user/api/blog-review/blog-review.module';
import { MagazineModule } from './api/magazine/magazine.module';
import { PinnedMagazineModule } from './api/pinned-magazine/pinned-magazine.module';
import { ServerExceptionsFilter } from '@libs/common/filters/server-exception.filter';
import { HashModule } from '@libs/common/modules/hash/hash.module';
import { PlaceSectionModule } from './api/place-section/place-section.module';
import { MagazineSectionModule } from './api/magazine-section/magazine-section.module';
import { AdminAccountCoreModule } from '@libs/core/admin-account/admin-account-core.module';
import { FoodStationModule } from './api/food-station/food-station.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricInterceptor } from '@libs/common/interceptors/metric.interceptor';
import { MetricModule } from '@libs/common/modules/metric/metric.module';
import { PrometheusApiModule } from './api/prometheus/prometheus.module';
import { UserMailModule } from './api/mail/user-mail.module';
import { InstallationLifecycleModule } from './api/installation-lifecyle/installation-lifecycle.module';
import { PushNotificationModule } from '@libs/common/modules/push-notification/push-notification.module';

@Module({
  imports: [
    PrismaModule,
    PlaceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ReviewModule,
    PickedPlaceModule,
    AuthModule,
    LoginTokenModule,
    MenuModule,
    S3UploadModule,
    BookmarkModule,
    DiscordWebhookModule,
    RedlockModule,
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
    BlogReviewModule,
    AopModule,
    MagazineModule,
    PinnedMagazineModule,
    HashModule,
    PlaceSectionModule,
    MagazineSectionModule,
    AdminAccountCoreModule,
    FoodStationModule,
    MetricModule,
    PrometheusApiModule,
    UserMailModule,
    InstallationLifecycleModule,
    PushNotificationModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(AccessTokenMiddleware).forRoutes('/');
  }
}
