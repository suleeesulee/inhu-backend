import { MagazineSeedInput } from '@libs/testing/seed/magazine/type/magazine-seed.input';

const PLACE_IMAGE = {
  BAKERY: '/place/bakery.jpg',
  HOSPITAL: '/place/hospital.jpg',
  MOSCOW: '/place/moscow.jpg',
  PARK: '/place/park.jpg',
  POOL: '/place/pool.jpg',
  SCHOOL: '/place/school.jpg',
  SOCCER_FIELD: '/place/soccer_field.jpg',
  THEATER: '/place/theater.jpg',
  CAFE1: '/place/cafe.jpg',
  BAR2: '/place/bar2.jpg',
  BAR3: '/place/bar3.jpg',
  BAR4: '/place/bar4.jpg',
  BAR5: '/place/bar5.jpg',
  RESTAURANT1: '/place/restaurant.jpeg',
  RESTAURANT2: '/place/restaurant2.jpg',
  RESTAURANT3: '/place/restaurant3.jpg',
};

const FIXED_ACTIVATED_AT = new Date('2025-08-22T00:00:00.000Z');

/**
 * 카테고리가 하나도 없는 매거진
 */
const magazine1: MagazineSeedInput = {
  title: '모든 카테고리 없음',
  description: '카테고리가 하나도 없는 매거진입니다.',
  content: '카테고리가 없는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.BAKERY,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: null,
  mainCategoryList: null,
  moodCategoryList: null,
};

/**
 * 식당 카테고리만 있는 매거진
 */
const magazine2: MagazineSeedInput = {
  title: '식당 카테고리만 있음',
  description: '식당 카테고리만 있는 매거진입니다.',
  content: '식당 카테고리만 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.HOSPITAL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2],
  mainCategoryList: null,
  moodCategoryList: null,
};

/**
 * 카페 카테고리만 있는 매거진
 */
const magazine3: MagazineSeedInput = {
  title: '카페 카테고리만 있음',
  description: '카페 카테고리만 있는 매거진입니다.',
  content: '카페 카테고리만 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.MOSCOW,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1],
  mainCategoryList: null,
  moodCategoryList: null,
};

/**
 * 술집 카테고리만 있는 매거진
 */
const magazine4: MagazineSeedInput = {
  title: '술집 카테고리만 있음',
  description: '술집 카테고리만 있는 매거진입니다.',
  content: '술집 카테고리만 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.PARK,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [3],
  mainCategoryList: null,
  moodCategoryList: null,
};

/**
 * 식당 + 카페 카테고리만 있는 매거진
 */
const magazine5: MagazineSeedInput = {
  title: '식당 + 카페 카테고리만 있음',
  description: '식당 + 카페 카테고리만 있는 매거진입니다.',
  content: '식당 + 카페 카테고리만 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.POOL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1, 2],
  mainCategoryList: null,
  moodCategoryList: null,
};

/**
 * 식당 + 술집 카테고리만 있는 매거진
 */
const magazine6: MagazineSeedInput = {
  title: '식당 + 술집 카테고리만 있음',
  description: '식당 + 술집 카테고리만 있는 매거진입니다.',
  content: '식당 + 술집 카테고리만 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.SCHOOL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2, 3],
  mainCategoryList: null,
  moodCategoryList: null,
};

/**
 * 카페 + 술집 카테고리만 있는 매거진
 */
const magazine7: MagazineSeedInput = {
  title: '카페 + 술집 카테고리만 있음',
  description: '카페 + 술집 카테고리만 있는 매거진입니다.',
  content: '카페 + 술집 카테고리만 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.SOCCER_FIELD,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1, 3],
  mainCategoryList: null,
  moodCategoryList: null,
};

/**
 * 식당 + 카페 + 술집 카테고리가 모두 있는 매거진
 */
const magazine8: MagazineSeedInput = {
  title: '식당 + 카페 + 술집 카테고리 모두 있음',
  description: '식당 + 카페 + 술집 카테고리가 모두 있는 매거진입니다.',
  content: '식당 + 카페 + 술집 카테고리가 모두 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.THEATER,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1, 2, 3],
  mainCategoryList: null,
  moodCategoryList: null,
};

/**
 * 식당, 밥집 카테고리가 있는 매거진 (분위기 카테고리 없음)
 */
const magazine9: MagazineSeedInput = {
  title: '식당, 밥집 카테고리 있음 (분위기 카테고리 없음)',
  description:
    '식당, 밥집 카테고리가 있는 매거진입니다. (분위기 카테고리 없음)',
  content:
    '식당, 밥집 카테고리가 있는 매거진의 내용입니다. (분위기 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.BAKERY,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2],
  mainCategoryList: [1],
  moodCategoryList: null,
};

/**
 * 식당, 밥집 + 일식 카테고리가 있는 매거진 (분위기 카테고리 없음)
 */
const magazine10: MagazineSeedInput = {
  title: '식당, 밥집 + 일식 카테고리 있음 (분위기 카테고리 없음)',
  description:
    '식당, 밥집 + 일식 카테고리가 있는 매거진입니다. (분위기 카테고리 없음)',
  content:
    '식당, 밥집 + 일식 카테고리가 있는 매거진의 내용입니다. (분위기 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.HOSPITAL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2],
  mainCategoryList: [1, 2],
  moodCategoryList: null,
};

/**
 * 식당, 밥집 + 양식 + 고기 카테고리가 있는 매거진 (분위기 카테고리 없음)
 */
const magazine11: MagazineSeedInput = {
  title: '식당, 밥집 + 양식 + 고기 카테고리 있음 (분위기 카테고리 없음)',
  description:
    '식당, 밥집 + 양식 + 고기 카테고리가 있는 매거진입니다. (분위기 카테고리 없음)',
  content:
    '식당, 밥집 + 양식 + 고기 카테고리가 있는 매거진의 내용입니다. (분위기 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.MOSCOW,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2],
  mainCategoryList: [1, 4, 8],
  moodCategoryList: null,
};

/**
 * 식당, 혼밥 카테고리가 있는 매거진 (메인 카테고리 없음)
 */
const magazine12: MagazineSeedInput = {
  title: '식당, 혼밥 카테고리 있음 (메인 카테고리 없음)',
  description: '식당, 혼밥 카테고리가 있는 매거진입니다. (메인 카테고리 없음)',
  content:
    '식당, 혼밥 카테고리가 있는 매거진의 내용입니다. (메인 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.PARK,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2],
  mainCategoryList: null,
  moodCategoryList: [1],
};

/**
 * 식당, 혼밥 + 데이트 카테고리가 있는 매거진 (메인 카테고리 없음)
 */
const magazine13: MagazineSeedInput = {
  title: '식당, 혼밥 + 데이트 카테고리 있음 (메인 카테고리 없음)',
  description:
    '식당, 혼밥 + 데이트 카테고리가 있는 매거진입니다. (메인 카테고리 없음)',
  content:
    '식당, 혼밥 + 데이트 카테고리가 있는 매거진의 내용입니다. (메인 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.POOL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2],
  mainCategoryList: null,
  moodCategoryList: [1, 2],
};

/**
 * 식당, 밥집, 혼밥 카테고리가 있는 매거진
 */
const magazine14: MagazineSeedInput = {
  title: '식당, 밥집, 혼밥 카테고리 있음',
  description: '식당, 밥집, 혼밥 카테고리가 있는 매거진입니다.',
  content: '식당, 밥집, 혼밥 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.SCHOOL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2],
  mainCategoryList: [1],
  moodCategoryList: [1],
};

/**
 * 식당, 밥집 + 양식, 혼밥 + 데이트 카테고리가 있는 매거진
 */
const magazine15: MagazineSeedInput = {
  title: '식당, 밥집 + 양식, 혼밥 + 데이트 카테고리 있음',
  description: '식당, 밥집 + 양식, 혼밥 + 데이트 카테고리가 있는 매거진입니다.',
  content:
    '식당, 밥집 + 양식, 혼밥 + 데이트 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.SOCCER_FIELD,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2],
  mainCategoryList: [1, 2],
  moodCategoryList: [1, 2],
};

/**
 * 카페, 베이커리 카테고리가 있는 매거진 (분위기 카테고리 없음)
 */
const magazine16: MagazineSeedInput = {
  title: '카페, 베이커리 카테고리 있음 (분위기 카테고리 없음)',
  description:
    '카페, 베이커리 카테고리가 있는 매거진입니다. (분위기 카테고리 없음)',
  content:
    '카페, 베이커리 카테고리가 있는 매거진의 내용입니다. (분위기 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.THEATER,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1],
  mainCategoryList: [9],
  moodCategoryList: null,
};

/**
 * 카페, 베이커리 + 샌드위치 카테고리가 있는 매거진 (분위기 카테고리 없음)
 */
const magazine17: MagazineSeedInput = {
  title: '카페, 베이커리 + 샌드위치 카테고리 있음 (분위기 카테고리 없음)',
  description:
    '카페, 베이커리 + 샌드위치 카테고리가 있는 매거진입니다. (분위기 카테고리 없음)',
  content:
    '카페, 베이커리 + 샌드위치 카테고리가 있는 매거진의 내용입니다. (분위기 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.BAKERY,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1],
  mainCategoryList: [9, 10],
  moodCategoryList: null,
};

/**
 * 카페, 분위기맛집 카테고리가 있는 매거진 (메인 카테고리 없음)
 */
const magazine18: MagazineSeedInput = {
  title: '카페, 분위기맛집 카테고리 있음 (메인 카테고리 없음)',
  description:
    '카페, 분위기맛집 카테고리가 있는 매거진입니다. (메인 카테고리 없음)',
  content:
    '카페, 분위기맛집 카테고리가 있는 매거진의 내용입니다. (메인 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.HOSPITAL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1],
  mainCategoryList: null,
  moodCategoryList: [4],
};

/**
 * 카페, 분위기맛집 + 카공맛집 카테고리가 있는 매거진 (메인 카테고리 없음)
 */
const magazine19: MagazineSeedInput = {
  title: '카페, 분위기맛집 + 카공맛집 카테고리 있음 (메인 카테고리 없음)',
  description:
    '카페, 분위기맛집 + 카공맛집 카테고리가 있는 매거진입니다. (메인 카테고리 없음)',
  content:
    '카페, 분위기맛집 + 카공맛집 카테고리가 있는 매거진의 내용입니다. (메인 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.MOSCOW,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1],
  mainCategoryList: null,
  moodCategoryList: [4, 5],
};

/**
 * 카페, 베이커리, 분위기맛집 카테고리가 있는 매거진
 */
const magazine20: MagazineSeedInput = {
  title: '카페, 베이커리, 분위기맛집 카테고리 있음',
  description: '카페, 베이커리, 분위기맛집 카테고리가 있는 매거진입니다.',
  content: '카페, 베이커리, 분위기맛집 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.PARK,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1],
  mainCategoryList: [9],
  moodCategoryList: [4],
};

/**
 * 카페, 베이커리 + 샌드위치, 분위기맛집 + 카공맛집 카테고리가 있는 매거진
 */
const magazine21: MagazineSeedInput = {
  title: '카페, 베이커리 + 샌드위치, 분위기맛집 + 카공맛집 카테고리 있음',
  description:
    '카페, 베이커리 + 샌드위치, 분위기맛집 + 카공맛집 카테고리가 있는 매거진입니다.',
  content:
    '카페, 베이커리 + 샌드위치, 분위기맛집 + 카공맛집 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.POOL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1],
  mainCategoryList: [9, 10],
  moodCategoryList: [4, 5],
};

/**
 * 술집, 이자카야 카테고리가 있는 매거진 (분위기 카테고리 없음)
 */
const magazine22: MagazineSeedInput = {
  title: '술집, 이자카야 카테고리 있음 (분위기 카테고리 없음)',
  description:
    '술집, 이자카야 카테고리가 있는 매거진입니다. (분위기 카테고리 없음)',
  content:
    '술집, 이자카야 카테고리가 있는 매거진의 내용입니다. (분위기 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.SCHOOL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [3],
  mainCategoryList: [15],
  moodCategoryList: null,
};

/**
 * 술집, 이자카야 + 요리주점 카테고리가 있는 매거진 (분위기 카테고리 없음)
 */
const magazine23: MagazineSeedInput = {
  title: '술집, 이자카야 + 요리주점 카테고리 있음 (분위기 카테고리 없음)',
  description:
    '술집, 이자카야 + 요리주점 카테고리가 있는 매거진입니다. (분위기 카테고리 없음)',
  content:
    '술집, 이자카야 + 요리주점 카테고리가 있는 매거진의 내용입니다. (분위기 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.SOCCER_FIELD,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [3],
  mainCategoryList: [15, 16],
  moodCategoryList: null,
};

/**
 * 술집, 혼술 카테고리가 있는 매거진 (메인 카테고리 없음)
 */
const magazine24: MagazineSeedInput = {
  title: '술집, 혼술 카테고리 있음 (메인 카테고리 없음)',
  description: '술집, 혼술 카테고리가 있는 매거진입니다. (메인 카테고리 없음)',
  content:
    '술집, 혼술 카테고리가 있는 매거진의 내용입니다. (메인 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.THEATER,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [3],
  mainCategoryList: null,
  moodCategoryList: [7],
};

/**
 * 술집, 혼술 + 단체 카테고리가 있는 매거진 (메인 카테고리 없음)
 */
const magazine25: MagazineSeedInput = {
  title: '술집, 혼술 + 단체 카테고리 있음 (메인 카테고리 없음)',
  description:
    '술집, 혼술 + 단체 카테고리가 있는 매거진입니다. (메인 카테고리 없음)',
  content:
    '술집, 혼술 + 단체 카테고리가 있는 매거진의 내용입니다. (메인 카테고리 없음)',
  thumbnailPath: PLACE_IMAGE.BAKERY,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [3],
  mainCategoryList: null,
  moodCategoryList: [7, 9],
};

/**
 * 술집, 이자카야, 혼술 카테고리가 있는 매거진
 */
const magazine26: MagazineSeedInput = {
  title: '술집, 이자카야, 혼술 카테고리 있음',
  description: '술집, 이자카야, 혼술 카테고리가 있는 매거진입니다.',
  content: '술집, 이자카야, 혼술 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.HOSPITAL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [3],
  mainCategoryList: [15],
  moodCategoryList: [7],
};

/**
 * 술집, 이자카야 + 요리주점, 혼술 + 단체 카테고리가 있는 매거진
 */
const magazine27: MagazineSeedInput = {
  title: '술집, 이자카야 + 요리주점, 혼술 + 단체 카테고리 있음',
  description:
    '술집, 이자카야 + 요리주점, 혼술 + 단체 카테고리가 있는 매거진입니다.',
  content:
    '술집, 이자카야 + 요리주점, 혼술 + 단체 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.MOSCOW,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [3],
  mainCategoryList: [15, 16],
  moodCategoryList: [7, 9],
};

/**
 * 식당 + 카페, 밥집 + 베이커리, 혼밥 + 분위기맛집 카테고리가 있는 매거진
 */
const magazine28: MagazineSeedInput = {
  title: '식당 + 카페, 밥집 + 베이커리, 혼밥 + 분위기맛집 카테고리 있음',
  description:
    '식당 + 카페, 밥집 + 베이커리, 혼밥 + 분위기맛집 카테고리가 있는 매거진입니다.',
  content:
    '식당 + 카페, 밥집 + 베이커리, 혼밥 + 분위기맛집 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.PARK,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1, 2],
  mainCategoryList: [1, 9],
  moodCategoryList: [1, 4],
};

/**
 * 식당 + 술집, 밥집 + 이자카야, 데이트 + 혼술 카테고리가 있는 매거진
 */
const magazine29: MagazineSeedInput = {
  title: '식당 + 술집, 밥집 + 이자카야, 데이트 + 혼술 카테고리 있음',
  description:
    '식당 + 술집, 밥집 + 이자카야, 데이트 + 혼술 카테고리가 있는 매거진입니다.',
  content:
    '식당 + 술집, 밥집 + 이자카야, 데이트 + 혼술 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.POOL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [2, 3],
  mainCategoryList: [1, 15],
  moodCategoryList: [2, 7],
};

/**
 * 식당 + 카페 + 술집, 밥집 + 베이커리 + 이자카야, 혼밥 + 분위기맛집 + 혼술 카테고리가 있는 매거진
 */
const magazine30: MagazineSeedInput = {
  title:
    '식당 + 카페 + 술집, 밥집 + 베이커리 + 이자카야, 혼밥 + 분위기맛집 + 혼술 카테고리 있음',
  description:
    '식당 + 카페 + 술집, 밥집 + 베이커리 + 이자카야, 혼밥 + 분위기맛집 + 혼술 카테고리가 있는 매거진입니다.',
  content:
    '식당 + 카페 + 술집, 밥집 + 베이커리 + 이자카야, 혼밥 + 분위기맛집 + 혼술 카테고리가 있는 매거진의 내용입니다.',
  thumbnailPath: PLACE_IMAGE.SCHOOL,
  isTitleVisible: true,
  activatedAt: FIXED_ACTIVATED_AT,
  placeIdxList: null,
  typeList: [1, 2, 3],
  mainCategoryList: [1, 9, 15],
  moodCategoryList: [1, 4, 7],
};

export const magazineSeedDataList = [
  magazine1,
  magazine2,
  magazine3,
  magazine4,
  magazine5,
  magazine6,
  magazine7,
  magazine8,
  magazine9,
  magazine10,
  magazine11,
  magazine12,
  magazine13,
  magazine14,
  magazine15,
  magazine16,
  magazine17,
  magazine18,
  magazine19,
  magazine20,
  magazine21,
  magazine22,
  magazine23,
  magazine24,
  magazine25,
  magazine26,
  magazine27,
  magazine28,
  magazine29,
  magazine30,
];
