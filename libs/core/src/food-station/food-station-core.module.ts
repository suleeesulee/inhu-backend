import { Module } from '@nestjs/common';
import { FoodStationCoreService } from './food-station-core.service';
import { FoodStationCoreRepository } from './food-station-core.repository';

@Module({
  providers: [FoodStationCoreService, FoodStationCoreRepository],
  exports: [FoodStationCoreService],
})
export class FoodStationCoreModule {}
