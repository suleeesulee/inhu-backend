import { Controller } from '@nestjs/common';
import { MagazineCdcService } from './magazine-cdc.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { MagazineTb } from './events/magazine-tb.event';
import { MagazineMainCategoryMappingTb } from './events/magazine-main-category-mapping-tb.event';
import { MagazineMoodCategoryMappingTb } from './events/magazine-mood-category-mapping-tb.event';
import { PlaceTypeMagazineMappingTb } from './events/place-type-magazine-mapping-tb.event';
import { MagazinePlaceTb } from './events/magazine-place-tb.event';
import { MagazineLikeTb } from './events/magazine-like-tb.event';

@Controller()
export class MagazineCdcController {
  constructor(private readonly magazineCdcService: MagazineCdcService) {}

  @MessagePattern('inhu.public.magazine_tb')
  public async magazineTbEvent(@Payload() message: DebeziumEvent<MagazineTb>) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.magazineCdcService.createDimMagazine(message.after, time);
  }

  @MessagePattern('inhu.public.magazine_like_tb')
  public async magazineLikeTbEvent(
    @Payload() message: DebeziumEvent<MagazineLikeTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.magazineCdcService.createDimMagazineLike(
        message.before,
        time,
        time,
      );
    } else {
      await this.magazineCdcService.createDimMagazineLike(message.after, time);
    }
  }

  @MessagePattern('inhu.public.place_type_magazine_mapping_tb')
  public async placeTypeMagazineMappingTbEvent(
    @Payload() message: DebeziumEvent<PlaceTypeMagazineMappingTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.magazineCdcService.createDimPlaceTypeMagazineMapping(
        message.before,
        time,
        time,
      );
    } else {
      await this.magazineCdcService.createDimPlaceTypeMagazineMapping(
        message.after,
        time,
      );
    }
  }

  @MessagePattern('inhu.public.magazine_main_category_mapping_tb')
  public async magazineMainCategoryMappingTbEvent(
    @Payload() message: DebeziumEvent<MagazineMainCategoryMappingTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.magazineCdcService.createDimMagazineMainCategoryMapping(
        message.before,
        time,
        time,
      );
    } else {
      await this.magazineCdcService.createDimMagazineMainCategoryMapping(
        message.after,
        time,
      );
    }
  }

  @MessagePattern('inhu.public.magazine_mood_category_mapping_tb')
  public async magazineMoodCategoryMappingTbEvent(
    @Payload() message: DebeziumEvent<MagazineMoodCategoryMappingTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.magazineCdcService.createDimMagazineMoodCategoryMapping(
        message.before,
        time,
        time,
      );
    } else {
      await this.magazineCdcService.createDimMagazineMoodCategoryMapping(
        message.after,
        time,
      );
    }
  }

  @MessagePattern('inhu.public.magazine_place_tb')
  public async magazinePlaceTbEvent(
    @Payload() message: DebeziumEvent<MagazinePlaceTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.magazineCdcService.createDimMagazinePlace(
        message.before,
        time,
        time,
      );
    } else {
      await this.magazineCdcService.createDimMagazinePlace(message.after, time);
    }
  }
}
