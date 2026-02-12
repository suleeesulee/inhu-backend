import { Module } from '@nestjs/common';
import { PlaceCdcController } from './place-cdc.controller';
import { PlaceCdcService } from './place-cdc.service';

@Module({
  imports: [],
  controllers: [PlaceCdcController],
  providers: [PlaceCdcService],
})
export class PlaceCdcModule {}
