import { Module } from '@nestjs/common';
import { PlaceVisitService } from './place-visit.service';
import { PlaceVisitCoreModule } from '@libs/core/place-visit/place-visit-core.module';
import { NfcCoreModule } from '@libs/core/nfc/nfc-core.module';
import { ConfigModule } from '@nestjs/config';
import nfcConfig from './config/nfc.config';
import { PlaceVisitController } from './place-visit.controller';
import { RedisModule } from '@libs/common/modules/redis/redis.module';

@Module({
  imports: [
    PlaceVisitCoreModule,
    NfcCoreModule,
    RedisModule,
    ConfigModule.forFeature(nfcConfig),
  ],
  controllers: [PlaceVisitController],
  providers: [PlaceVisitService],
  exports: [PlaceVisitService],
})
export class PlaceVisitModule {}
