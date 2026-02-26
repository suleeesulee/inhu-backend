import { Controller } from '@nestjs/common';
import { MenuCdcService } from './menu-cdc.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { MenuTb } from './events/menu-tb.event';
import { MenuReviewTb } from './events/menu-review-tb.event';

@Controller()
export class MenuCdcController {
  constructor(private readonly menuCdcService: MenuCdcService) {}

  @MessagePattern('inhu.public.menu_tb')
  public async menuTbEvent(@Payload() message: DebeziumEvent<MenuTb>) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.menuCdcService.createDimMenu(message.after, time);
  }

  @MessagePattern('inhu.public.menu_review_tb')
  public async menuReviewTbEvent(
    @Payload() message: DebeziumEvent<MenuReviewTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.menuCdcService.createDimMenuReview(message.before, time, time);
    } else {
      await this.menuCdcService.createDimMenuReview(message.after, time);
    }
  }
}
