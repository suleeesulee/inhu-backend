import { NotificationModel } from '@libs/core/notification/model/notification.model';
import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { NotificationPageType } from '@libs/core/notification/constants/notification-page-type.constant';

export class NotificationEntity {
  /**
   * 알림 식별자
   */
  public id: string;

  /**
   * 알림 제목
   */
  public title: string;

  /**
   * 알림 내용
   */
  public content: string;

  /**
   * 알림 클릭 시 이동할 페이지 타입
   */
  @IsEnumValue(NotificationPageType)
  public pageType: NotificationPageType;

  /**
   * 생성 시간
   */
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
