import { NotificationCoreService } from '@libs/core/notification/notification-core.service';
import { Injectable } from '@nestjs/common';
import { GetNotificationAllDto } from './dto/request/get-notification-all.dto';
import { GetNotificationAllResponseDto } from './dto/response/get-notification-all.response.dto';
import { NotificationEntity } from './entity/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationCoreService: NotificationCoreService,
  ) {}

  public async getNotificationAll(
    dto: GetNotificationAllDto,
    userIdx?: number,
  ): Promise<GetNotificationAllResponseDto> {
    const PAGE_SIZE = 10;
    const notificationList =
      await this.notificationCoreService.getNotificationAllForUser({
        take: PAGE_SIZE + 1,
        skip: (dto.page - 1) * PAGE_SIZE,
        userIdx,
      });

    return {
      hasNext: notificationList.length > PAGE_SIZE,
      notificationList: notificationList
        .slice(0, PAGE_SIZE)
        .map(NotificationEntity.fromModel),
    };
  }
}
