import { Controller } from '@nestjs/common';
import { KeywordCdcService } from './keyword-cdc.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { KeywordTb } from './events/keyword-tb.event';

@Controller()
export class KeywordCdcController {
  constructor(private readonly keywordCdcService: KeywordCdcService) {}

  @MessagePattern('inhu.public.keyword_tb')
  public async keywordTbEvent(@Payload() message: DebeziumEvent<KeywordTb>) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.keywordCdcService.createDimKeyword(message.after, time);
  }
}
