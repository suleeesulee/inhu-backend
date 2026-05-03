import { Module } from '@nestjs/common';
import { MealOfferingCoreService } from './meal-offering-core.service';
import { MealOfferingCoreRepository } from './meal-offering-core.repository';

@Module({
  providers: [MealOfferingCoreService, MealOfferingCoreRepository],
  exports: [MealOfferingCoreService],
})
export class MealOfferingCoreModule {}
