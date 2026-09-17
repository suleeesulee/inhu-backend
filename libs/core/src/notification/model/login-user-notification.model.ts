import { NotificationModel } from './notification.model';
import { SelectLoginUserNotification } from './prisma-type/select-login-user-notification';

/**
 * @publicApi
 */
export class LoginUserNotificationModel {
  public notificationId: string;
  public userIdx: number;
  public createdAt: Date;
  public notification: NotificationModel;

  constructor(data: LoginUserNotificationModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    loginUserNotification: SelectLoginUserNotification,
  ): LoginUserNotificationModel {
    return new LoginUserNotificationModel({
      notificationId: loginUserNotification.notificationId,
      userIdx: loginUserNotification.userIdx,
      createdAt: loginUserNotification.createdAt,
      notification: NotificationModel.fromPrisma(
        loginUserNotification.notification,
      ),
    });
  }
}
