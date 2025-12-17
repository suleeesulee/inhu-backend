import { PickType } from '@nestjs/swagger';
import { MagazineModel } from './magazine.model';
import { SelectMagazineOverview } from './prisma-type/select-magazine-overview';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';

export class MagazineOverviewModel extends PickType(MagazineModel, [
  'idx',
  'title',
  'description',
  'thumbnailImagePath',
  'isTitleVisible',
  'likeCount',
  'viewCount',
  'createdAt',
  'activatedAt',
  'pinnedAt',
  'typeList',
  'mainCategoryList',
  'moodCategoryList',
]) {
  constructor(data: MagazineOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    magazine: SelectMagazineOverview,
  ): MagazineOverviewModel {
    return new MagazineOverviewModel({
      idx: magazine.idx,
      title: magazine.title,
      description: magazine.description,
      thumbnailImagePath: magazine.thumbnailImagePath,
      isTitleVisible: magazine.isTitleVisible,
      likeCount: magazine.likeCount,
      viewCount: magazine.viewCount,
      createdAt: magazine.createdAt,
      activatedAt: magazine.activatedAt,
      pinnedAt: magazine.pinnedMagazine?.createdAt || null,
      typeList: magazine.placeTypeMagazineMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx as PlaceType,
      ),
      mainCategoryList: magazine.magazineMainCategoryMappingList.map(
        ({ mainCategoryIdx }) => mainCategoryIdx as MainCategory,
      ),
      moodCategoryList: magazine.magazineMoodCategoryMappingList.map(
        ({ moodCategoryIdx }) => moodCategoryIdx as MoodCategory,
      ),
    });
  }
}
