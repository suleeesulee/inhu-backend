import { PlaceController } from '@admin/api/place/place.controller';
import { PlaceService } from '@admin/api/place/place.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { Logger, Module } from '@nestjs/common';
import { KakaoAddressModule } from '@libs/modules/kakao-address/kakao-address.module';
import { FreeTagCoreModule } from '@libs/core/free-tag/free-tag-core.module';

@Module({
  imports: [PlaceCoreModule, KakaoAddressModule, FreeTagCoreModule],
  controllers: [PlaceController],
  providers: [PlaceService, Logger],
  exports: [],
})
export class PlaceModule {}
