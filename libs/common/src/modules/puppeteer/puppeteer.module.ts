import { Module } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { ConfigModule } from '@nestjs/config';
import puppeteerConfig from './config/puppeteer.config';

@Module({
  imports: [ConfigModule.forFeature(puppeteerConfig)],
  providers: [PuppeteerService],
  exports: [PuppeteerService],
})
export class PuppeteerModule {}
