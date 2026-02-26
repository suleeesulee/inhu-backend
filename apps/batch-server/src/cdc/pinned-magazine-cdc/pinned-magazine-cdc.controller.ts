import { Controller } from '@nestjs/common';
import { PinnedMagazineCdcService } from './pinned-magazine-cdc.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { PinnedMagazineTb } from './events/pinned-magazine-tb.event';

@Controller()
export class PinnedMagazineCdcController {
  constructor(
    private readonly pinnedMagazineCdcService: PinnedMagazineCdcService,
  ) {}

  @MessagePattern('inhu.public.pinned_magazine_tb')
  public async pinnedMagazineTbEvent(
    @Payload() message: DebeziumEvent<PinnedMagazineTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.pinnedMagazineCdcService.createDimPinnedMagazine(
        message.before,
        time,
        time,
      );
    } else {
      await this.pinnedMagazineCdcService.createDimPinnedMagazine(
        message.after,
        time,
      );
    }
  }
}
