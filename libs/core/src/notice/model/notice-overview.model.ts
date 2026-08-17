import { PickType } from '@nestjs/swagger';
import { NoticeModel } from './notice.model';
import { SelectNoticeOverview } from './prisma-type/select-notice-overview';
import { NoticeAuthorModel } from './notice-author.model';

/**
 * @publicApi
 */
export class NoticeOverviewModel extends PickType(NoticeModel, [
  'idx',
  'authorIdx',
  'title',
  'createdAt',
  'author',
]) {
  constructor(data: NoticeOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(notice: SelectNoticeOverview): NoticeOverviewModel {
    return new NoticeOverviewModel({
      idx: notice.idx,
      authorIdx: notice.authorIdx,
      title: notice.title,
      createdAt: notice.createdAt,
      author: NoticeAuthorModel.fromPrisma(notice.author),
    });
  }
}
