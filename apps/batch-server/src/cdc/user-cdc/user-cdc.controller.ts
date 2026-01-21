import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { UserTb } from './events/user-tb.event';
import { UserCdcService } from './user-cdc.service';

@Controller()
export class UserCdcController {
  constructor(private readonly userCdcService: UserCdcService) {}

  @MessagePattern('inhu.public.user_tb')
  public async userTbEvent(@Payload() message: DebeziumEvent<UserTb>) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.userCdcService.createDimUser(message.after, time);
  }
}
