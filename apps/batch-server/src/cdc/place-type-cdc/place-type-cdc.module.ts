import { Module } from '@nestjs/common';
import { PlaceTypeCdcController } from './place-type-cdc.controller';
import { PlaceTypeCdcService } from './place-type-cdc.service';

@Module({
  imports: [],
  controllers: [PlaceTypeCdcController],
  providers: [PlaceTypeCdcService],
})
export class PlaceTypeCdcModule {}
