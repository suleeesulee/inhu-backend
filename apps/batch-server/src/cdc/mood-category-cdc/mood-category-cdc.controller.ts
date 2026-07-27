import { Controller } from '@nestjs/common';
import { MoodCategoryCdcService } from './mood-category-cdc.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { MoodCategoryTb } from './events/mood-category-tb.event';

@Controller()
export class MoodCategoryCdcController {
  constructor(
    private readonly moodCategoryCdcService: MoodCategoryCdcService,
  ) {}

  @MessagePattern('inhu.public.mood_category_tb')
  public async mainCategoryTbEvent(
    @Payload() message: DebeziumEvent<MoodCategoryTb>,
  ) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.moodCategoryCdcService.createDimMoodCategory(
      message.after,
      time,
    );
  }
}
