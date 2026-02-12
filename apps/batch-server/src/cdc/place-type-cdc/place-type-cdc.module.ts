import { Module } from '@nestjs/common';
import { PlaceTypeCdcController } from './place-type-cdc.controller';
import { PlaceTypeCdcService } from './place-type-cdc.service';
import { PlaceTypeLogCoreModule } from '@libs/log-core/place-type-log-core/place-type-log-core.module';

@Module({
  imports: [PlaceTypeLogCoreModule],
  controllers: [PlaceTypeCdcController],
  providers: [PlaceTypeCdcService],
})
export class PlaceTypeCdcModule {}
