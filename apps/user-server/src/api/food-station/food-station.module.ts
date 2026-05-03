import { DailyMemoCoreModule } from '@libs/core/daily-memo/daily-memo-core.module';
import { FoodStationCoreModule } from '@libs/core/food-station/food-station-core.module';
import { Module } from '@nestjs/common';
import { FoodStationController } from './food-station.controller';
import { FoodStationService } from './food-station.service';
import { CafeteriaCoreModule } from '@libs/core/cafeteria/cafeteria-core.module';

@Module({
  imports: [FoodStationCoreModule, DailyMemoCoreModule, CafeteriaCoreModule],
  controllers: [FoodStationController],
  providers: [FoodStationService],
})
export class FoodStationModule {}
