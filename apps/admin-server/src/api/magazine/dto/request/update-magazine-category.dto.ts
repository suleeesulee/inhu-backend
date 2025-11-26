import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';

export class UpdateMagazineCategoryDto {
  /**
   * 장소 유형 리스트
   */
  @ToArray()
  @UniqueArray()
  @IsEnumValue(PlaceType, { each: true })
  public typeList: PlaceType[];

  /**
   * 메인 카테고리 리스트
   */
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MainCategory, { each: true })
  public mainCategoryList: MainCategory[];

  /**
   * 무드 카테고리 리스트
   */
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MoodCategory, { each: true })
  public moodCategoryList: MoodCategory[];
}
