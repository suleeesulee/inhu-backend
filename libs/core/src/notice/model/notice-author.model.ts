import { SelectNoticeAuthor } from './prisma-type/select-notice-author';

/**
 * 공지사항 작성자 모델
 *
 * @publicApi
 */
export class NoticeAuthorModel {
  /**
   * 작성자 식별자
   */
  public idx: number;

  /**
   * 작성자 닉네임
   */
  public nickname: string;

  /**
   * 작성자 프로필 이미지 경로
   */
  public profileImagePath: string | null;

  constructor(data: NoticeAuthorModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(author: SelectNoticeAuthor): NoticeAuthorModel {
    return new NoticeAuthorModel({
      idx: author.idx,
      nickname: author.nickname,
      profileImagePath: author.profileImagePath,
    });
  }
}
