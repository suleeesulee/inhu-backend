import { NoticeModel } from '@libs/core/notice/model/notice.model';
import { NoticeAuthorEntity } from './notice-author.entity';

export class NoticeEntity {
  /**
   * 공지사항 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 제목
   *
   * @example "서비스 점검 안내"
   */
  public title: string;

  /**
   * 내용
   *
   * @example "2025년 1월 1일 00:00 ~ 06:00 서비스 점검이 있습니다."
   */
  public content: string;

  /**
   * 생성 시간
   *
   * @example "2025-01-01T00:00:00Z"
   */
  public createdAt: Date;

  /**
   * 작성자 정보
   */
  public author: NoticeAuthorEntity;

  constructor(data: NoticeEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: NoticeModel): NoticeEntity {
    return new NoticeEntity({
      idx: model.idx,
      title: model.title,
      content: model.content,
      createdAt: model.createdAt,
      author: NoticeAuthorEntity.fromModel(model.author),
    });
  }
}
