import { NotificationCoreService } from '@libs/core/notification/notification-core.service';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/request/create-notification.dto';
import { GetNotificationAllDto } from './dto/request/get-notification-all.dto';
import { GetNotificationAllResponseDto } from './dto/response/get-notification-all.response.dto';
import { NotificationEntity } from './entity/notification.entity';

const PAGE_SIZE = 10;

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationCoreService: NotificationCoreService,
  ) {}

  public async getNotificationAll(
    dto: GetNotificationAllDto,
  ): Promise<GetNotificationAllResponseDto> {
    const [notificationList, count] = await Promise.all([
      this.notificationCoreService.getNotificationAll({
        take: PAGE_SIZE,
        skip: (dto.page - 1) * PAGE_SIZE,
      }),
      this.notificationCoreService.getNotificationCount(),
    ]);

    return {
      count,
      notificationList: notificationList.map(NotificationEntity.fromModel),
    };
  }

  public async createNotification(
    dto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    return NotificationEntity.fromModel(
      await this.notificationCoreService.createNotification({
        title: dto.title,
        content: dto.content,
        pageType: dto.pageType,
      }),
    );
  }
}
