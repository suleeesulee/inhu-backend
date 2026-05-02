import { MealOfferingCoreModule } from '@libs/core/meal-offering/meal-offering-core.module';
import { Module } from '@nestjs/common';
import { MealOfferingController } from './meal-offering.controller';
import { MealOfferingService } from './meal-offering.service';
import { FoodStationCoreModule } from '@libs/core/food-station/food-station-core.module';

@Module({
  imports: [MealOfferingCoreModule, FoodStationCoreModule],
  controllers: [MealOfferingController],
  providers: [MealOfferingService],
  exports: [MealOfferingService],
})
export class MealOfferingModule {}
