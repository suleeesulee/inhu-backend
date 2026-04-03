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
import { PlaceSectionModule } from './api/place-section/place-section.module';
import { MagazineSectionModule } from './api/magazine-section/magazine-section.module';

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
    PlaceSectionModule,
    MagazineSectionModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: ServerExceptionsFilter,
    },
  ],
})
export class AdminServerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(AdminAccessTokenMiddleware).forRoutes('/');
  }
}
