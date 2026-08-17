import { Module } from '@nestjs/common';
import { PlaceVisitCoreService } from './place-visit-core.service';
import { PlaceVisitCoreRepository } from './place-visit-core.repository';

@Module({
  providers: [PlaceVisitCoreService, PlaceVisitCoreRepository],
  exports: [PlaceVisitCoreService],
})
export class PlaceVisitCoreModule {}
