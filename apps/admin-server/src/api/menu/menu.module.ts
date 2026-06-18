import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuCoreModule } from '@libs/core/menu/menu-core.module';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { ReviewCoreModule } from '@libs/core/review/review-core.module';
import { NaverMenuModule } from '@libs/common/modules/naver-menu/naver-menu.module';
import { S3Module } from '@libs/common/modules/s3/s3.module';
import { HttpModule } from '@nestjs/axios';
import { NaverMenuWorkerService } from './naver-menu-worker.service';
import { InternalNaverMenuAuthGuard } from './internal-naver-menu-auth.guard';
import { ConfigModule } from '@nestjs/config';
import naverMenuWorkerConfig from './config/naver-menu-worker.config';

@Module({
  imports: [
    HttpModule,
    MenuCoreModule,
    PlaceCoreModule,
    ReviewCoreModule,
    NaverMenuModule,
    S3Module,
    ConfigModule.forFeature(naverMenuWorkerConfig),
  ],
  controllers: [MenuController],
  providers: [MenuService, NaverMenuWorkerService, InternalNaverMenuAuthGuard],
  exports: [],
})
export class MenuModule {}
