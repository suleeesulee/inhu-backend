import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BroadcastNotificationDto } from './dto/request/broadcast-notification.dto';
import { SendPushNotificationDto } from './dto/request/send-push-notification.dto';
import { AdminPushNotificationService } from './admin-push-notification.service';

@Controller('push-notification')
@ApiTags('PushNotification')
export class AdminPushNotificationController {
  constructor(
    private readonly adminPushNotificationService: AdminPushNotificationService,
  ) {}

  /**
   * 전체 사용자 대상 알림 발송
   */
  @Post('broadcast')
  @HttpCode(HttpStatus.ACCEPTED)
  @AdminAuth()
  public async broadcastNotification(
    @Body() dto: BroadcastNotificationDto,
  ): Promise<void> {
    await this.adminPushNotificationService.broadcastNotification(dto);
  }

  /**
   * 입력한 디바이스 토큰으로 푸시 알림 발송
   */
  @Post('send')
  @AdminAuth()
  public async sendPushNotification(
    @Body() dto: SendPushNotificationDto,
  ): Promise<void> {
    await this.adminPushNotificationService.sendPushNotification(dto);
  }
}
