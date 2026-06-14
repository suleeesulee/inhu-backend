import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ga4Config from './config/ga4.config';
import { Ga4Service } from './ga4.service';

@Module({
  imports: [ConfigModule.forFeature(ga4Config)],
  controllers: [],
  providers: [Ga4Service],
  exports: [Ga4Service],
})
export class Ga4Module {}
