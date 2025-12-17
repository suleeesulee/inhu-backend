import { PickType } from '@nestjs/swagger';
import { MagazineOverviewModel } from './magazine-overview.model';
import { SelectLikedMagazineOverview } from './prisma-type/select-liked-magazine-overview';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';

export class LikedMagazineOverviewModel extends PickType(
  MagazineOverviewModel,
  [
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
  ],
) {
  constructor(data: LikedMagazineOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    likedMagazine: SelectLikedMagazineOverview,
  ): LikedMagazineOverviewModel {
    return new LikedMagazineOverviewModel({
      idx: likedMagazine.magazine.idx,
      title: likedMagazine.magazine.title,
      description: likedMagazine.magazine.description,
      thumbnailImagePath: likedMagazine.magazine.thumbnailImagePath,
      isTitleVisible: likedMagazine.magazine.isTitleVisible,
      likeCount: likedMagazine.magazine.likeCount,
      viewCount: likedMagazine.magazine.viewCount,
      createdAt: likedMagazine.magazine.createdAt,
      activatedAt: likedMagazine.magazine.activatedAt,
      pinnedAt: likedMagazine.magazine.pinnedMagazine?.createdAt || null,
      typeList: likedMagazine.magazine.placeTypeMagazineMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx as PlaceType,
      ),
      mainCategoryList:
        likedMagazine.magazine.magazineMainCategoryMappingList.map(
          ({ mainCategoryIdx }) => mainCategoryIdx as MainCategory,
        ),
      moodCategoryList:
        likedMagazine.magazine.magazineMoodCategoryMappingList.map(
          ({ moodCategoryIdx }) => moodCategoryIdx as MoodCategory,
        ),
    });
  }
}
