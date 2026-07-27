import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MagazinePlaceModel } from './magazine-place.model';
import { SelectMagazine } from './prisma-type/select-magazine';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';

export class MagazineModel {
  /**
   * 매거진 식별자
   */
  public idx: number;

  /**
   * 매거진 작성자 식별자
   */
  public authorIdx: number;

  /**
   * 매거진 제목
   */
  public title: string;

  /**
   * 매거진 설명
   */
  public description: string | null;

  /**
   * 매거진 내용
   */
  public content: string;

  /**
   * 썸네일 이미지 경로
   */
  public thumbnailImagePath: string | null;

  /**
   * 썸네일 제목 표시 여부
   */
  public isTitleVisible: boolean;

  /**
   * 좋아요 수
   */
  public likeCount: number;

  /**
   * 조회 수
   */
  public viewCount: number;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  /**
   * 활성화 시간
   */
  public activatedAt: Date | null;

  /**
   * 매거진 장소 리스트
   */
  public placeList: MagazinePlaceModel[];

  /**
   * 고정한 시간
   */
  public pinnedAt: Date | null;

  /**
   * 특정 장소 유형 목록
   */
  public typeList: PlaceType[];

  /**
   * 메인 카테고리 리스트
   */
  public mainCategoryList: MainCategory[];

  /**
   * 분위기 카테고리 리스트
   */
  public moodCategoryList: MoodCategory[];

  constructor(data: MagazineModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(magazine: SelectMagazine): MagazineModel {
    return new MagazineModel({
      idx: magazine.idx,
      authorIdx: magazine.authorIdx,
      title: magazine.title,
      description: magazine.description,
      content: magazine.content,
      thumbnailImagePath: magazine.thumbnailImagePath,
      isTitleVisible: magazine.isTitleVisible,
      likeCount: magazine.likeCount,
      viewCount: magazine.viewCount,
      createdAt: magazine.createdAt,
      activatedAt: magazine.activatedAt,
      placeList: magazine.placeList.map((mp) =>
        MagazinePlaceModel.fromPrisma(mp),
      ),
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
