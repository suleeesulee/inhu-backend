import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserCdcController {
  constructor() {}

  @MessagePattern('inhu.public.user_tb')
  public async test(@Payload() message: any) {
    console.log(message);
  }
}
