import { Module } from '@nestjs/common';
import { PlaceVisitService } from './place-visit.service';
import { PlaceVisitCoreModule } from '@libs/core/place-visit/place-visit-core.module';

@Module({
  imports: [PlaceVisitCoreModule],
  providers: [PlaceVisitService],
  exports: [PlaceVisitService],
})
export class PlaceVisitModule {}
