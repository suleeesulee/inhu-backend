import { PlaceRoadAddressEntity } from './place-road-address.entity';
import { PlaceOperatingHourEntity } from './place-operating-hour.entity';
import { PlaceClosedDayEntity } from './place-closed-day.entity';
import { PlaceBreakTimeEntity } from './place-break-time.entity';
import { KeywordEntity } from '@admin/api/keyword/entity/keyword.entity';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { PlaceModel } from '@libs/core/place/model/place.model';
import { PlaceWeeklyClosedDayEntity } from './place-weekly-closed-day.entity';
import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { Type } from 'class-transformer';
import { TrimStringArray } from '@libs/common/decorator/trim-string-array.decorator';
import { FreeTagEntity } from '@admin/api/free-tag/entity/free-tag.entity';

export class PlaceEntity {
  /**
   * place Idx
   *
   * @example 1
   */
  public idx: number;

  /**
   * place name
   *
   * @example '동아리 닭갈비'
   */
  @IsString()
  public name: string;

  /**
   * 상호 전화번호
   *
   * @example '032-1111-2222'
   */
  @IsString()
  @IsOptional()
  public tel: string | null;

  /**
   * 주소
   */
  public roadAddress: PlaceRoadAddressEntity;

  /**
   * 해당 장소에 가장 많이 평가된 최대 2개의 키워드 목록
   */
  public topKeywordList: KeywordEntity[];

  /**
   * 생성 날짜
   */
  public createdAt: Date;

  /**
   * review count
   *
   * @example 1
   */
  public reviewCount: number;

  /**
   * 활성화 여부
   *
   * @example null
   */
  public activatedAt: Date | null;

  /**
   * 가게 폐점 여부
   *
   * @example null
   */
  public permanentlyClosedAt: Date | null;

  /**
   * 공휴일에 쉬는지 유무
   *
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  public isClosedOnHoliday: boolean | null;

  /**
   * 특정 장소 image path list
   *
   * @example ['place/f9c2e36f-8e99-4b18-b3e8-7cd327682f94_20240706_124512.jpg', 'place/12345678-1234-5678-1234-123456789012_20240706_124512.jpg']
   */
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  public imagePathList: string[];

  /**
   * 특정 장소의 타입
   */
  @IsEnumValue(PlaceType)
  public type: PlaceType;

  /**
   * 격주 또는 규칙 휴무일 정보
   */
  public weeklyClosedDayList: PlaceWeeklyClosedDayEntity[];

  /**
   * 운영 시간 정보
   */
  public operatingHourList: PlaceOperatingHourEntity[];

  /**
   * 정기 휴무일 정보
   */
  public closedDayList: PlaceClosedDayEntity[];

  /**
   * 브레이크 타임 정보
   */
  public breakTimeList: PlaceBreakTimeEntity[];

  /**
   * 메인 카테고리 목록
   */
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MainCategory, { each: true })
  public mainCategoryList: MainCategory[];

  /**
   * 분위기 카테고리 목록
   */
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MoodCategory, { each: true })
  public moodCategoryList: MoodCategory[];

  /**
   * 특정 장소 타입 목록
   */
  @ToArray()
  @UniqueArray()
  @IsEnumValue(PlaceType, { each: true })
  public typeList: PlaceType[];

  /**
   * 자유 태그 목록
   */
  public freeTagList: FreeTagEntity[];

  constructor(data: PlaceEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceModel): PlaceEntity {
    return new PlaceEntity({
      idx: model.idx,
      name: model.name,
      tel: model.tel,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      createdAt: model.createdAt,
      reviewCount: model.reviewCount,
      isClosedOnHoliday: model.isClosedOnHoliday,
      imagePathList: model.imgPathList,
      type: model.type,
      weeklyClosedDayList: model.weeklyClosedDayList.map(
        PlaceWeeklyClosedDayEntity.fromModel,
      ),
      operatingHourList: model.operatingHourList.map(
        PlaceOperatingHourEntity.fromModel,
      ),
      closedDayList: model.closedDayList.map(PlaceClosedDayEntity.fromModel),
      breakTimeList: model.breakTimeList.map(PlaceBreakTimeEntity.fromModel),
      activatedAt: model.activatedAt,
      permanentlyClosedAt: model.permanentlyClosedAt,
      mainCategoryList: model.mainCategoryList,
      moodCategoryList: model.moodCategoryList,
      typeList: model.typeList,
      freeTagList: model.freeTagList.map(FreeTagEntity.fromModel),
    });
  }
}
