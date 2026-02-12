import { Controller } from '@nestjs/common';
import { PlaceCdcService } from './place-cdc.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { PlaceTb } from './events/place-tb.event';
import { PlaceTypeMappingTb } from './events/place-type-mapping-tb.event';
import { PlaceMainCategoryMappingTb } from './events/place-main-category-mapping-tb.event';
import { PlaceMoodCategoryMappingTb } from './events/place-mood-category-mapping-tb.event';
import { PlaceImageTb } from './events/place-image-tb.event';
import { ClosedDayTb } from './events/closed-day-tb.event';
import { OperatingHourTb } from './events/operating-hour-tb.event';
import { WeeklyClosedDayTb } from './events/weekly-closed-day-tb.event';
import { BreakTimeTb } from './events/break-time-tb.event';
import { RoadAddressTb } from './events/road-address-tb.event';

@Controller()
export class PlaceCdcController {
  constructor(private readonly placeCdcService: PlaceCdcService) {}

  @MessagePattern('inhu.public.place_tb')
  public async placeTbEvent(@Payload() message: DebeziumEvent<PlaceTb>) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimPlace(message.after, time);
  }

  @MessagePattern('inhu.public.road_address_tb')
  public async roadAddressTbEvent(
    @Payload() message: DebeziumEvent<RoadAddressTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimRoadAddress(message.after, time);
  }

  @MessagePattern('inhu.public.place_type_mapping_tb')
  public async placeTypeMappingTbEvent(
    @Payload() message: DebeziumEvent<PlaceTypeMappingTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimPlaceTypeMapping(message.after, time);
  }

  @MessagePattern('inhu.public.place_main_category_mapping_tb')
  public async placeMainCategoryMappingTbEvent(
    @Payload() message: DebeziumEvent<PlaceMainCategoryMappingTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimPlaceMainCategoryMapping(
      message.after,
      time,
    );
  }

  @MessagePattern('inhu.public.place_mood_category_mapping_tb')
  public async placeMoodCategoryMappingTbEvent(
    @Payload() message: DebeziumEvent<PlaceMoodCategoryMappingTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimPlaceMoodCategoryMapping(
      message.after,
      time,
    );
  }

  @MessagePattern('inhu.public.place_image_tb')
  public async placeImageTbEvent(
    @Payload() message: DebeziumEvent<PlaceImageTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimPlaceImage(message.after, time);
  }

  @MessagePattern('inhu.public.closed_day_tb')
  public async closedDayTbEvent(
    @Payload() message: DebeziumEvent<ClosedDayTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimClosedDay(message.after, time);
  }

  @MessagePattern('inhu.public.operating_hour_tb')
  public async operatingHourTbEvent(
    @Payload() message: DebeziumEvent<OperatingHourTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimOperatingHour(message.after, time);
  }

  @MessagePattern('inhu.public.weekly_closed_day_tb')
  public async weeklyClosedDayTbEvent(
    @Payload() message: DebeziumEvent<WeeklyClosedDayTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimWeeklyClosedDay(message.after, time);
  }

  @MessagePattern('inhu.public.break_time_tb')
  public async breakTimeTbEvent(
    @Payload() message: DebeziumEvent<BreakTimeTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeCdcService.createDimBreakTime(message.after, time);
  }
}
