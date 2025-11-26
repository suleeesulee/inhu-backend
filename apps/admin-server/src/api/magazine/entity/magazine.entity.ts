import { MagazineModel } from '@libs/core/magazine/model/magazine.model';
import { MagazinePlaceEntity } from './magazine-place.entity';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';

export class MagazineEntity {
  /**
   * 매거진 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 매거진 제목
   *
   * @example "맛집 탐방"
   */
  public title: string;

  /**
   * 매거진 설명
   *
   * @example "서울에서 꼭 가봐야 할 맛집을 소개합니다."
   */
  public description: string | null;

  /**
   * 매거진 내용
   *
   * @example "이번 주말에 가볼 만한 맛집을 소개합니다."
   */
  public content: string;

  /**
   * 썸네일 이미지 경로
   *
   * @example "/magazine/thumbnail1.jpg"
   */
  public thumbnailImagePath: string | null;

  /**
   * 썸네일 제목 표시 여부
   *
   * @example false
   */
  public isTitleVisible: boolean;

  /**
   * 좋아요 수
   *
   * @example 32
   */
  public likeCount: number;

  /**
   * 조회 수
   *
   * @example 120
   */
  public viewCount: number;

  /**
   * 생성 시간
   *
   * @example "2025-10-09T12:00:00Z"
   */
  public createdAt: Date;

  /**
   * 활성화 시간
   *
   * @example "2025-10-10T12:00:00Z"
   */
  public activatedAt: Date | null;

  /**
   * 매거진 장소 리스트
   */
  public placeList: MagazinePlaceEntity[];

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

  /**
   * 고정한 시간
   *
   * @example "2025-10-09T12:00:00Z"
   */
  public pinnedAt: Date | null;

  constructor(data: MagazineEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: MagazineModel): MagazineEntity {
    return new MagazineEntity({
      idx: model.idx,
      title: model.title,
      description: model.description,
      content: model.content,
      thumbnailImagePath: model.thumbnailImagePath,
      isTitleVisible: model.isTitleVisible,
      likeCount: model.likeCount,
      viewCount: model.viewCount,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
      placeList: model.placeList.map(MagazinePlaceEntity.fromModel),
      pinnedAt: model.pinnedAt,
      typeList: model.typeList,
      mainCategoryList: model.mainCategoryList,
      moodCategoryList: model.moodCategoryList,
    });
  }
}
