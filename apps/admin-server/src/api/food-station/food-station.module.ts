import { FoodStationCoreModule } from '@libs/core/food-station/food-station-core.module';
import { Module } from '@nestjs/common';
import { FoodStationController } from './food-station.controller';
import { FoodStationService } from './food-station.service';
import { CafeteriaCoreModule } from '@libs/core/cafeteria/cafeteria-core.module';
import { HttpModule } from '@nestjs/axios';
import { OpenAIModule } from '@libs/common/modules/openAI/openAI.module';
import { PuppeteerModule } from '@libs/common/modules/puppeteer/puppeteer.module';

@Module({
  imports: [
    FoodStationCoreModule,
    CafeteriaCoreModule,
    HttpModule,
    OpenAIModule,
    PuppeteerModule,
  ],
  controllers: [FoodStationController],
  providers: [FoodStationService],
})
export class FoodStationModule {}
