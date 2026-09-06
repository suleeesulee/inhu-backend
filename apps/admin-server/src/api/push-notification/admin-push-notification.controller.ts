import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { PushNotificationService } from '@libs/common/modules/push-notification/push-notification.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendPushNotificationDto } from './dto/request/send-push-notification.dto';

@Controller('push-notification')
@ApiTags('PushNotification')
export class AdminPushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  /**
   * 입력한 디바이스 토큰으로 푸시 알림 발송
   */
  @Post('send')
  @AdminAuth()
  public async sendPushNotification(
    @Body() dto: SendPushNotificationDto,
  ): Promise<void> {
    await this.pushNotificationService.send(dto);
  }
}
