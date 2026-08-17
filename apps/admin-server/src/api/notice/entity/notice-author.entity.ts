import { NoticeAuthorModel } from '@libs/core/notice/model/notice-author.model';

export class NoticeAuthorEntity {
  /**
   * 작성자 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 작성자 닉네임
   *
   * @example "jochong"
   */
  public nickname: string;

  /**
   * 작성자 프로필 이미지 경로
   *
   * @example "/user/profile.jpg"
   */
  public profileImagePath: string | null;

  constructor(data: NoticeAuthorEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: NoticeAuthorModel): NoticeAuthorEntity {
    return new NoticeAuthorEntity({
      idx: model.idx,
      nickname: model.nickname,
      profileImagePath: model.profileImagePath,
    });
  }
}
