import { Module } from '@nestjs/common';
import { NaverMenuService } from './naver-menu.service';
import { ConfigModule } from '@nestjs/config';
import naverMenuConfig from './config/naver-menu.config';
import { PcmapStrategy } from './strategy/pcmap.strategy';
import { BookingStrategy } from './strategy/booking.strategy';
import { PuppeteerModule } from '../puppeteer/puppeteer.module';

@Module({
  imports: [ConfigModule.forFeature(naverMenuConfig), PuppeteerModule],
  providers: [NaverMenuService, PcmapStrategy, BookingStrategy],
  exports: [NaverMenuService],
})
export class NaverMenuModule {}
