import { SelectNotification } from './prisma-type/select-notification';

/**
 * @publicApi
 */
export class NotificationModel {
  public id: string;
  public title: string;
  public content: string;
  public pageType: number;
  public createdAt: Date;

  constructor(data: NotificationModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    notification: SelectNotification,
  ): NotificationModel {
    return new NotificationModel({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      pageType: notification.pageType,
      createdAt: notification.createdAt,
    });
  }
}
