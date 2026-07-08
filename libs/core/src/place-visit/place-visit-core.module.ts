import { Module } from '@nestjs/common';
import { PlaceVisitCoreService } from './place-visit-core.service';

@Module({
  providers: [PlaceVisitCoreService, PlaceVisitCoreService],
  exports: [PlaceVisitCoreService],
})
export class PlaceVisitCoreModule {}
