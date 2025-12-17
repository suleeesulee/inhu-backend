import { PickType } from '@nestjs/swagger';
import { MagazineEntity } from './magazine.entity';
import { MagazineOverviewModel } from '@libs/core/magazine/model/magazine-overview.model';

export class MagazineOverviewEntity extends PickType(MagazineEntity, [
  'idx',
  'title',
  'description',
  'thumbnailImagePath',
  'isTitleVisible',
  'likeCount',
  'viewCount',
  'createdAt',
  'isLiked',
  'typeList',
  'mainCategoryList',
  'moodCategoryList',
]) {
  constructor(data: MagazineOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: MagazineOverviewModel,
    isLiked: boolean,
  ): MagazineOverviewEntity {
    return new MagazineOverviewEntity({
      idx: model.idx,
      title: model.title,
      description: model.description,
      thumbnailImagePath: model.thumbnailImagePath,
      isTitleVisible: model.isTitleVisible,
      likeCount: model.likeCount,
      viewCount: model.viewCount,
      createdAt: model.createdAt,
      isLiked,
      typeList: model.typeList,
      mainCategoryList: model.mainCategoryList,
      moodCategoryList: model.moodCategoryList,
    });
  }
}
