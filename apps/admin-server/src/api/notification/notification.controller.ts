import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/request/create-notification.dto';
import { NotificationEntity } from './entity/notification.entity';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * 알림 생성
   */
  @Post()
  @AdminAuth()
  public async createNotification(
    @Body() dto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    return await this.notificationService.createNotification(dto);
  }
}
