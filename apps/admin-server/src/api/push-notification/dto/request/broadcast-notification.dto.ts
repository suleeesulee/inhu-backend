import { IsUUID } from 'class-validator';

export class BroadcastNotificationDto {
  /**
   * 전체 발송할 알림 식별자
   */
  @IsUUID()
  public notificationId: string;
}
