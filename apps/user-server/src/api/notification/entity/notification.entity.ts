import { NotificationModel } from '@libs/core/notification/model/notification.model';

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
  public pageType: number;

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
