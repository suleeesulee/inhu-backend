import { SelectNotice } from './prisma-type/select-notice';

/**
 * @publicApi
 */
export class NoticeModel {
  /**
   * 공지사항 식별자
   */
  public idx: number;

  /**
   * 작성자 식별자
   */
  public authorIdx: number;

  /**
   * 제목
   */
  public title: string;

  /**
   * 내용
   */
  public content: string;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  constructor(data: NoticeModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(notice: SelectNotice): NoticeModel {
    return new NoticeModel({
      idx: notice.idx,
      authorIdx: notice.authorIdx,
      title: notice.title,
      content: notice.content,
      createdAt: notice.createdAt,
    });
  }
}
