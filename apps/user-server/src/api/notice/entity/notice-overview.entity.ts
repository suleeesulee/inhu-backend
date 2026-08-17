import { PickType } from '@nestjs/swagger';
import { NoticeEntity } from './notice.entity';
import { NoticeOverviewModel } from '@libs/core/notice/model/notice-overview.model';

export class NoticeOverviewEntity extends PickType(NoticeEntity, [
  'idx',
  'title',
  'createdAt',
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
    });
  }
}
