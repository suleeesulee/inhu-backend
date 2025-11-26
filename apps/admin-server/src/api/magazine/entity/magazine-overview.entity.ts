import { PickType } from '@nestjs/swagger';
import { MagazineEntity } from './magazine.entity';
import { MagazineOverviewModel } from '@libs/core/magazine/model/magazine-overview.model';

export class MagazineOverviewEntity extends PickType(MagazineEntity, [
  'idx',
  'title',
  'thumbnailImagePath',
  'createdAt',
  'activatedAt',
  'pinnedAt',
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
  ): MagazineOverviewEntity {
    return new MagazineOverviewEntity({
      idx: model.idx,
      title: model.title,
      thumbnailImagePath: model.thumbnailImagePath,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
      pinnedAt: model.pinnedAt,
      typeList: model.typeList,
      mainCategoryList: model.mainCategoryList,
      moodCategoryList: model.moodCategoryList,
    });
  }
}
