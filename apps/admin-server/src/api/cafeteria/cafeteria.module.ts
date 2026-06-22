import { CafeteriaCoreModule } from '@libs/core/cafeteria/cafeteria-core.module';
import { DailyMemoCoreModule } from '@libs/core/daily-memo/daily-memo-core.module';
import { FoodStationCoreModule } from '@libs/core/food-station/food-station-core.module';
import { Module } from '@nestjs/common';
import { CafeteriaController } from './cafeteria.controller';
import { CafeteriaService } from './cafeteria.service';

@Module({
  imports: [CafeteriaCoreModule, DailyMemoCoreModule, FoodStationCoreModule],
  controllers: [CafeteriaController],
  providers: [CafeteriaService],
})
export class CafeteriaModule {}
