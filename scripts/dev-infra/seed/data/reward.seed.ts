import { RewardSeedInput } from '@libs/testing/seed/reward/type/reward-seed.input';
import { PLACE_IMAGE } from './place.seed';

const activatedAt = new Date();
activatedAt.setUTCFullYear(activatedAt.getUTCFullYear() - 3);

export const rewardSeedDataList: RewardSeedInput[] = [
  {
    name: '스타벅스 아메리카노 쿠폰 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.CAFE1,
    activatedAt,
  },
  {
    name: '배달의민족 1만원 쿠폰 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.RESTAURANT1,
    activatedAt,
  },
  {
    name: 'KFC 치킨 버거 세트 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.RESTAURANT2,
    activatedAt,
  },
  {
    name: '올리브영 1만원 쿠폰 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.RESTAURANT3,
    activatedAt,
  },
  {
    name: '투썸플레이스 케이크 쿠폰 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.BAKERY,
    activatedAt,
  },
  {
    name: 'CU 편의점 5천원 쿠폰 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.SCHOOL,
    activatedAt,
  },
  {
    name: '도서문화상품권 1만원권 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.THEATER,
    activatedAt,
  },
  {
    name: '메가커피 아이스 아메리카노 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.HOSPITAL,
    activatedAt,
  },
  {
    name: '신세계 상품권 3만원권 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.MOSCOW,
    activatedAt,
  },
  {
    name: 'GS25 편의점 5천원 쿠폰 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.PARK,
    activatedAt,
  },
  {
    name: '맘스터치 싸이버거 세트 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.POOL,
    activatedAt,
  },
  {
    name: '네이버페이 1만원 포인트 (활성화·선택 가능)',
    imagePath: PLACE_IMAGE.SOCCER_FIELD,
    activatedAt,
  },
  {
    name: '애플뮤직 1개월 이용권 (비활성화·선택 불가)',
    imagePath: PLACE_IMAGE.BAR2,
    activatedAt: null,
  },
  {
    name: '영화 관람권 2매 (비활성화·선택 불가)',
    imagePath: PLACE_IMAGE.BAR3,
    activatedAt: null,
  },
  {
    name: '요가 체험권 1회 (비활성화·선택 불가)',
    imagePath: PLACE_IMAGE.BAR4,
    activatedAt: null,
  },
  {
    name: '고급 립스틱 세트 (삭제됨)',
    imagePath: PLACE_IMAGE.BAR5,
    activatedAt,
    deletedAt: new Date(),
  },
];

export const activeRewardSeedIdxList = rewardSeedDataList.flatMap(
  (reward, index) =>
    reward.activatedAt && !reward.deletedAt ? [index + 1] : [],
);
