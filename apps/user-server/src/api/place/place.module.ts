import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { BookmarkCoreModule } from '@libs/core/bookmark/bookmark-core.module';
import { PlaceV2Controller } from './place-v2.controller';

@Module({
  imports: [PlaceCoreModule, BookmarkCoreModule],
  controllers: [PlaceController, PlaceV2Controller],
  providers: [PlaceService],
})
export class PlaceModule {}
