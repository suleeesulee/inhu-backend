import { RewardSeedInput } from '@libs/testing/seed/reward/type/reward-seed.input';

export const rewardSeedDataList: RewardSeedInput[] = [
  {
    name: '스타벅스 아메리카노 쿠폰 (활성화·선택 가능)',
    imagePath: '/reward/starbucks-americano.png',
    activatedAt: new Date(),
  },
  {
    name: '배달의민족 1만원 쿠폰 (활성화·선택 가능)',
    imagePath: '/reward/baemin-coupon.png',
    activatedAt: new Date(),
  },
  {
    name: 'KFC 치킨 버거 세트 (비활성화·선택 불가)',
    imagePath: '/reward/kfc-burger-set.png',
    activatedAt: null,
  },
  {
    name: '올리브영 1만원 쿠폰 (활성화·선택 가능)',
    imagePath: '/reward/olive-young-coupon.png',
    activatedAt: new Date(),
  },
  {
    name: '고급 립스틱 세트 (삭제됨)',
    imagePath: '/reward/lipstick-set.png',
    activatedAt: new Date(),
    deletedAt: new Date(),
  },
  {
    name: '투썸플레이스 케이크 쿠폰 (비활성화·선택 불가)',
    imagePath: '/reward/twosome-cake.png',
    activatedAt: null,
  },
  {
    name: 'CU 편의점 5천원 쿠폰 (활성화·선택 가능)',
    imagePath: '/reward/cu-coupon.png',
    activatedAt: new Date(),
  },
  {
    name: '도서문화상품권 1만원권 (활성화·선택 가능)',
    imagePath: '/reward/book-culture-gift-card.png',
    activatedAt: new Date(),
  },
  {
    name: '메가커피 아이스 아메리카노 (비활성화·선택 불가)',
    imagePath: '/reward/mega-coffee-ice-americano.png',
    activatedAt: null,
  },
  {
    name: '신세계 상품권 3만원권 (활성화·선택 가능)',
    imagePath: '/reward/shinsegae-gift-card.png',
    activatedAt: new Date(),
  },
];
