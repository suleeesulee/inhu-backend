import { MagazineOverviewModel } from '@libs/core/magazine/model/magazine-overview.model';
import { PickType } from '@nestjs/swagger';
import { MagazineOverviewEntity } from '@user/api/magazine/entity/magazine-overview.entity';

export class SectionMagazineOverviewEntity extends PickType(
  MagazineOverviewEntity,
  [
    'idx',
    'title',
    'description',
    'thumbnailImagePath',
    'isTitleVisible',
    'likeCount',
    'viewCount',
    'createdAt',
    'typeList',
    'mainCategoryList',
    'moodCategoryList',
  ],
) {
  constructor(data: SectionMagazineOverviewEntity) {
    super(data);
    Object.assign(this, data);
  }

  public static fromModel(
    model: MagazineOverviewModel,
  ): SectionMagazineOverviewEntity {
    return new SectionMagazineOverviewEntity({
      ...model,
    });
  }
}
