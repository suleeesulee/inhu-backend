import { NotificationModel } from './notification.model';
import { SelectUserNotification } from './prisma-type/select-user-notification';

/**
 * @publicApi
 */
export class UserNotificationModel {
  public notificationId: string;
  public userIdx: number;
  public createdAt: Date;
  public notification: NotificationModel;

  constructor(data: UserNotificationModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    userNotification: SelectUserNotification,
  ): UserNotificationModel {
    return new UserNotificationModel({
      notificationId: userNotification.notificationId,
      userIdx: userNotification.userIdx,
      createdAt: userNotification.createdAt,
      notification: NotificationModel.fromPrisma(userNotification.notification),
    });
  }
}
