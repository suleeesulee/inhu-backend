import { Controller } from '@nestjs/common';
import { MainCategoryCdcService } from './main-category-cdc.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { MainCategoryTb } from './events/main-category-tb.event';

@Controller()
export class MainCategoryCdcController {
  constructor(
    private readonly mainCategoryCdcService: MainCategoryCdcService,
  ) {}

  @MessagePattern('inhu.public.main_category_tb')
  public async mainCategoryTbEvent(
    @Payload() message: DebeziumEvent<MainCategoryTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.mainCategoryCdcService.createDimMainCategory(
      message.after,
      time,
    );
  }
}
