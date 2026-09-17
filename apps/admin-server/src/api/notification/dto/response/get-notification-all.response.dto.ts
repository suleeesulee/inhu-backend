import { NotificationEntity } from '../../entity/notification.entity';

export class GetNotificationAllResponseDto {
  /**
   * 전체 알림 수
   */
  public count: number;

  /**
   * 알림 목록
   */
  public notificationList: NotificationEntity[];
}
