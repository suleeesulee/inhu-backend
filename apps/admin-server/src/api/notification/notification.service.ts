import { NotificationCoreService } from '@libs/core/notification/notification-core.service';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/request/create-notification.dto';
import { NotificationEntity } from './entity/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationCoreService: NotificationCoreService,
  ) {}

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
