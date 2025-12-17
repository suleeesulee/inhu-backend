import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { WeeklyCloseType } from '@libs/core/place/constants/weekly-close-type.constant';

/**
 * place 시드 입력 타입 정의
 *
 * @publicApi
 */
export type PlaceSeedInput = {
  name?: string;
  tel?: string | null;
  /**
   * @default 0
   */
  reviewCount?: number;

  /**
   * @default 0
   */
  bookmarkCount?: number;

  isClosedOnHoliday?: boolean | null;
  deletedAt?: Date | null;
  permanentlyClosedAt?: Date | null;
  activatedAt?: Date | null;
  placeImgList?: string[];
  type?: PlaceType;
  roadAddress?: {
    name?: string;
    detail?: string | null;
    addressX?: number;
    addressY?: number;
  };
  closedDayList?:
    | {
        day: DayOfWeek;
        week: number;
      }[]
    | null;
  operatingHourList?:
    | {
        startAt: Date;
        endAt: Date;
        day: DayOfWeek;
      }[]
    | null;
  weeklyClosedDayList?:
    | {
        closedDate: Date;
        type: WeeklyCloseType;
      }[]
    | null;
  breakTime?:
    | {
        startAt: Date;
        endAt: Date;
        day: DayOfWeek;
      }[]
    | null;
  keywordCountList?:
    | {
        keywordIdx: number;
        count: number;
      }[]
    | null;
  mainCategoryList?: MainCategory[] | null;
  moodCategoryList?: MoodCategory[] | null;
  typeList?: PlaceType[] | null;
};
