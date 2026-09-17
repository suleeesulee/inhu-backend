import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/request/create-notification.dto';
import { GetNotificationAllDto } from './dto/request/get-notification-all.dto';
import { GetNotificationAllResponseDto } from './dto/response/get-notification-all.response.dto';
import { NotificationEntity } from './entity/notification.entity';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * 전체 알림 목록 조회
   */
  @Get('all')
  @AdminAuth()
  public async getNotificationAll(
    @Query() dto: GetNotificationAllDto,
  ): Promise<GetNotificationAllResponseDto> {
    return await this.notificationService.getNotificationAll(dto);
  }

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
