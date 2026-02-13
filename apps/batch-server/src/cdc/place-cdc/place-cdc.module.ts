import { Module } from '@nestjs/common';
import { PlaceCdcController } from './place-cdc.controller';
import { PlaceCdcService } from './place-cdc.service';
import { PlaceLogCoreModule } from '@libs/log-core/place-log-core/place-log-core.module';

@Module({
  imports: [PlaceLogCoreModule],
  controllers: [PlaceCdcController],
  providers: [PlaceCdcService],
})
export class PlaceCdcModule {}
