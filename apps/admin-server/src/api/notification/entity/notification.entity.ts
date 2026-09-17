import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { NotificationPageType } from '@libs/core/notification/constants/notification-page-type.constant';
import { NotificationModel } from '@libs/core/notification/model/notification.model';

export class NotificationEntity {
  public id: string;
  public title: string;
  public content: string;
  public pageType: NotificationPageType;

  public createdAt: Date;

  constructor(data: NotificationEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: NotificationModel): NotificationEntity {
    return new NotificationEntity({
      id: model.id,
      title: model.title,
      content: model.content,
      pageType: model.pageType,
      createdAt: model.createdAt,
    });
  }
}
