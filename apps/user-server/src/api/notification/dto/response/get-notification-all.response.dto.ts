import { NotificationEntity } from '../../entity/notification.entity';

export class GetNotificationAllResponseDto {
  /**
   * 다음 페이지 존재 여부
   */
  public hasNext: boolean;

  /**
   * 알림 목록
   */
  public notificationList: NotificationEntity[];
}
