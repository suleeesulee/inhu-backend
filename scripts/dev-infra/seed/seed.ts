import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { ReviewSeedHelper } from '@libs/testing/seed/review/review.seed';
import { PickedPlaceSeedHelper } from '@libs/testing/seed/picked-place/picked-place.seed';
import { MenuSeedHelper } from '@libs/testing/seed/menu/menu.seed';
import { PlaceSeedDataList } from './data/place.seed';
import { MagazineSeedHelper } from '@libs/testing/seed/magazine/magazine.seed';
import { magazineSeedDataList } from './data/magazine.seed';
import { FreeTagSeedHelper } from '@libs/testing/seed/free-tag/free-tag.seed';
import { SearchTagSeedHelper } from '@libs/testing/seed/search-tag/search-tag.seed';
import { PlaceSectionSeedHelper } from '@libs/testing/seed/place-section/place-section';
import { placeSectionSeedDataList } from './data/place-section.seed';

const prisma = new PrismaService();

async function main() {
  await prisma.onModuleInit();

  const placeSeedHelper = new PlaceSeedHelper(prisma);
  const userSeedHelper = new UserSeedHelper(prisma);
  const reviewSeedHelper = new ReviewSeedHelper(prisma);
  const pickedPlaceSeedHelper = new PickedPlaceSeedHelper(prisma);
  const menuSeedHelper = new MenuSeedHelper(prisma);
  const magazineSeedHelper = new MagazineSeedHelper(prisma);
  const freeTagSeedHelper = new FreeTagSeedHelper(prisma);
  const searchTagSeedHelper = new SearchTagSeedHelper(prisma);
  const placeSectionSeedHelper = new PlaceSectionSeedHelper(prisma);

  /**
   * 사용자 생성
   */
  const user1 = await userSeedHelper.seed({
    nickname: '맛집탐방가',
    profileImagePath: '/profile/cat.jpg',
  });
  const user2 = await userSeedHelper.seed({ nickname: '인덕이' });
  const userList = { user1, user2 };

  await freeTagSeedHelper.seedAll([
    { content: '가성비' },
    { content: '맛집' },
    { content: '인기' },
    { content: '추천' },
    { content: '신규' },
    { content: '현지인추천' },
    { content: '재방문의사' },
    { content: '혼밥가능' },
    { content: '데이트코스' },
    { content: '단체모임' },
    { content: '포장가능' },
    { content: '주차가능' },
    { content: '늦게까지영업' },
    { content: '분위기좋음' },
    { content: '웨이팅맛집' },
  ]);
  await searchTagSeedHelper.seedAll([
    { content: '돈까스' },
    { content: '라멘' },
    { content: '자장면' },
    { content: '닭발' },
    { content: '카레' },
    { content: '국밥' },
    { content: '해장국' },
    { content: '순대국' },
    { content: '제육볶음' },
    { content: '삼겹살' },
    { content: '곱창' },
    { content: '초밥' },
    { content: '파스타' },
    { content: '피자' },
    { content: '샐러드' },
    { content: '샌드위치' },
    { content: '브런치' },
    { content: '디저트' },
    { content: '빙수' },
    { content: '와플' },
    { content: '베이글' },
    { content: '떡볶이' },
    { content: '김밥' },
    { content: '칼국수' },
    { content: '냉면' },
  ]);

  /**
   * 장소 생성
   */
  for (const placeData of PlaceSeedDataList) {
    const place = await placeSeedHelper.seed(placeData);

    // 장소의 리뷰 목록 시딩
    if (placeData.reviewList && placeData.reviewList.length > 0) {
      for (const review of placeData.reviewList) {
        const user = userList[review.userKey];
        await reviewSeedHelper.seed({
          ...review,
          placeIdx: place.idx,
          userIdx: user.idx,
        });
      }
    }

    // 장소의 메뉴 목록 시딩
    if (placeData.menuList && placeData.menuList.length > 0) {
      for (const menu of placeData.menuList) {
        await menuSeedHelper.seed({
          ...menu,
          placeIdx: place.idx,
        });
      }
    }

    // 장소의 pickedPlace 목록 시딩
    if (placeData.pickedPlaceList && placeData.pickedPlaceList.length > 0) {
      for (const pickedPlace of placeData.pickedPlaceList) {
        await pickedPlaceSeedHelper.seed({
          ...pickedPlace,
          placeIdx: place.idx,
        });
      }
    }
  }

  /**
   * 매거진 생성
   */
  for (const magazineData of magazineSeedDataList) {
    await magazineSeedHelper.seed({ ...magazineData, authorIdx: user1.idx });
  }

  /**
   * place section 생성
   */
  for (const placeSectionData of placeSectionSeedDataList) {
    await placeSectionSeedHelper.seed({ ...placeSectionData });
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
