import { PickType } from '@nestjs/swagger';
import { NoticeEntity } from './notice.entity';
import { NoticeOverviewModel } from '@libs/core/notice/model/notice-overview.model';
import { NoticeAuthorEntity } from './notice-author.entity';

export class NoticeOverviewEntity extends PickType(NoticeEntity, [
  'idx',
  'title',
  'createdAt',
  'author',
]) {
  constructor(data: NoticeOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: NoticeOverviewModel): NoticeOverviewEntity {
    return new NoticeOverviewEntity({
      idx: model.idx,
      title: model.title,
      createdAt: model.createdAt,
      author: NoticeAuthorEntity.fromModel(model.author),
    });
  }
}
