import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetNotificationAllDto } from './dto/request/get-notification-all.dto';
import { GetNotificationAllResponseDto } from './dto/response/get-notification-all.response.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * 공개 알림 및 로그인 사용자의 개인 알림 목록 조회
   * - 알림 페이지에서 알림 목록 조회 시 사용
   */
  @Get('all')
  public async getNotificationAll(
    @Query() dto: GetNotificationAllDto,
    @User() loginUser?: LoginUser,
  ): Promise<GetNotificationAllResponseDto> {
    return await this.notificationService.getNotificationAll(
      dto,
      loginUser?.idx,
    );
  }
}
