import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { PlaceTypeTb } from './events/place-type-tb.event';
import { PlaceTypeCdcService } from './place-type-cdc.service';

@Controller()
export class PlaceTypeCdcController {
  constructor(private readonly placeTypeCdcService: PlaceTypeCdcService) {}

  @MessagePattern('inhu.public.place_type_tb')
  public async mainCategoryTbEvent(
    @Payload() message: DebeziumEvent<PlaceTypeTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.placeTypeCdcService.createDimPlaceType(message.after, time);
  }
}
