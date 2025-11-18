import { Module } from '@nestjs/common';
import { NaverMenuService } from './naver-menu.service';
import { ConfigModule } from '@nestjs/config';
import naverMenuConfig from './config/naver-menu.config';

@Module({
  imports: [ConfigModule.forFeature(naverMenuConfig)],
  providers: [NaverMenuService],
  exports: [NaverMenuService],
})
export class NaverMenuModule {}
