import { Module } from '@nestjs/common';
import { PlaceLogCoreService } from './place-log-core.service';
import { PlaceLogCoreRepository } from './place-log-core.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [PlaceLogCoreService, PlaceLogCoreRepository],
  exports: [PlaceLogCoreService],
})
export class PlaceLogCoreModule {}
