import { Module } from '@nestjs/common';
import { PlaceTypeLogCoreService } from './place-type-log-core.service';
import { PlaceTypeLogCoreRepository } from './place-type-log-core.repository';

@Module({
  imports: [],
  providers: [PlaceTypeLogCoreService, PlaceTypeLogCoreRepository],
  exports: [PlaceTypeLogCoreService],
})
export class PlaceTypeLogCoreModule {}
