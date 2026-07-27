import { TestHelper } from '../../setup/test.helper';
import { AdminServerModule } from '@admin/admin-server.module';
import { GetAllReviewResponseDto } from '@admin/api/review/dto/response/get-all-review.reponse.dto';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { ReviewSeedHelper } from '@libs/testing/seed/review/review.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { ManagedUserSeedHelper } from '@libs/testing/seed/user/managed-user.seed';
import { ReviewEntity } from '@admin/api/review/entity/review.entity';
import { CreateReviewDto } from '@admin/api/review/dto/request/create-review.dto';
import { UpdateReviewDto } from '@admin/api/review/dto/request/update-review.dto';

describe('Admin Review E2E Tests', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const managedUserSeedHelper = testHelper.seedHelper(ManagedUserSeedHelper);
  const reviewSeedHelper = testHelper.seedHelper(ReviewSeedHelper);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('DELETE /review/:reviewIdx', () => {
    it('200 - delete check', async () => {
      const adminUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      await testHelper
        .test()
        .delete(`/review/${originalReview.idx}`)
        .set('Cookie', `token=Bearer ${adminUser.token}`)
        .expect(200);

      const review = await testHelper.getPrisma().review.findUnique({
        where: { idx: originalReview.idx },
      });

      expect(review?.deletedAt).not.toBeNull();
    });

    it('200 - check DB side effects', async () => {
      const adminUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const placeBefore = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      const keywordIdxList = originalReview.keywordIdxList || [];

      const keywordCountBefore = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: keywordIdxList },
          },
        });

      const beforeMap = new Map(
        keywordCountBefore.map((kc) => [kc.keywordIdx, kc.count]),
      );

      await testHelper
        .test()
        .delete(`/review/${originalReview.idx}`)
        .set('Cookie', `token=Bearer ${adminUser.token}`)
        .expect(200);

      const placeAfter = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      expect(placeAfter.reviewCount).toBe(placeBefore.reviewCount - 1);

      const keywordCountAfter = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: keywordIdxList },
          },
        });

      const afterMap = new Map(
        keywordCountAfter.map((kc) => [kc.keywordIdx, kc.count]),
      );

      for (const keywordIdx of keywordIdxList) {
        const before = beforeMap.get(keywordIdx) ?? 0;
        const after = afterMap.get(keywordIdx) ?? 0;
        expect(after).toBe(before - 1);
      }
    });

    it('401 - token is missing', async () => {
      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      await testHelper
        .test()
        .delete(`/review/${originalReview.idx}`)
        .expect(401);
    });

    it('404 - review does not exist', async () => {
      const adminUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/review/9999999') // ! 존재하지 않는 reviewIdx
        .set('Cookie', `token=Bearer ${adminUser.token}`)
        .expect(404);
    });

    it('500 - transaction failure', async () => {
      const adminUser = testHelper.loginAdmin.admin1;
      testHelper.mockDiscordWebhookSendErrorMessage();

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
        content: '기본 리뷰입니다.',
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
        ],
        keywordIdxList: [1],
      });

      const keywordIdxList = originalReview.keywordIdxList || [];

      const placeBefore = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });

      const keywordCountBefore = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: keywordIdxList },
          },
        });

      const beforeMap = new Map(
        keywordCountBefore.map((kc) => [kc.keywordIdx, kc.count]),
      );

      // 원본 함수 백업
      // 테스트 후를 위해 prisma의 실제 update 함수를 백업
      const originalUpdateFn = testHelper.getPrisma().review.update;

      try {
        // 직접 만든 가짜 모의 함수를 실제 update 함수에 덮어씀
        testHelper.getPrisma().review.update = jest
          .fn()
          .mockImplementation(() => Promise.reject());

        // 가짜 함수가 실행되어 에러 발생
        await testHelper
          .test()
          .delete(`/review/${originalReview.idx}`)
          .set('Cookie', `token=Bearer ${adminUser.token}`)
          .expect(500);
      } finally {
        // 원래 함수로 복원
        testHelper.getPrisma().review.update = originalUpdateFn;
      }

      // 상태 유지 확인 (롤백 검증)
      const reviewAfter = await testHelper
        .getPrisma()
        .review.findUniqueOrThrow({
          where: { idx: originalReview.idx },
        });
      expect(reviewAfter.deletedAt).toBeNull();

      const placeAfter = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: place.idx },
      });
      expect(placeAfter.reviewCount).toBe(placeBefore.reviewCount);

      const keywordCountAfter = await testHelper
        .getPrisma()
        .placeKeywordCount.findMany({
          where: {
            placeIdx: place.idx,
            keywordIdx: { in: keywordIdxList },
          },
        });

      const afterMap = new Map(
        keywordCountAfter.map((kc) => [kc.keywordIdx, kc.count]),
      );

      for (const keywordIdx of keywordIdxList) {
        const before = beforeMap.get(keywordIdx) ?? 0;
        const after = afterMap.get(keywordIdx) ?? 0;
        expect(after).toBe(before);
      }
    });
  });

  describe('GET /review/all', () => {
    it('200 - review field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
        roadAddress: {
          name: '서울시 강남구 테헤란로 123',
          detail: '테헤란로 123',
        },
      });

      const reviewSeed = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
        reviewImgList: [
          '/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg',
          '/review/f994f6ad-c42f-4c29-86db-d391fe450b1f-20250719.jpg',
        ],
        keywordIdxList: [1, 2],
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: place.idx,
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const body: GetAllReviewResponseDto = response.body;

      const { reviewList } = body;

      const resultReview = reviewList[0];

      expect(resultReview.idx).toBe(reviewSeed.idx);
      expect(resultReview.content).toBe(reviewSeed.content);
      expect(resultReview.imagePathList.sort()).toStrictEqual(
        (reviewSeed.reviewImgList || [])?.sort(),
      );
      expect(
        resultReview.keywordList.map(({ idx }) => idx).sort(),
      ).toStrictEqual((reviewSeed.keywordIdxList || [])?.sort());
      expect(resultReview.place.idx).toBe(place.idx);
      expect(resultReview.place.name).toBe(place.name);
      expect(resultReview.place.roadAddress.name).toBe(place.roadAddress.name);
      expect(resultReview.place.roadAddress.detail).toBe(
        place.roadAddress.detail,
      );
      expect(resultReview.place.roadAddress.addressX).toBe(
        place.roadAddress.addressX,
      );
      expect(resultReview.place.roadAddress.addressY).toBe(
        place.roadAddress.addressY,
      );
      expect(resultReview.author.idx).toBe(user.idx);
      expect(resultReview.author.nickname).toBe(user.nickname);
      expect(resultReview.author.profileImagePath).toBe(user.profileImagePath);
    });

    it('200 - hasNext check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // placeIdx가 place.idx인 리뷰 10개 생성
      await reviewSeedHelper.seedAll(
        Array.from({ length: 10 }, () => ({
          placeIdx: place.idx,
          userIdx: user.idx,
        })),
      );

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: place.idx,
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const body: GetAllReviewResponseDto = response.body;

      expect(body.hasNext).toBe(false);

      // 10개에서 하나 더 넣기
      await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: loginUser.idx,
      });

      const response2 = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: place.idx,
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response2.body.hasNext).toBe(true);
    });

    it('200 - sort order asc check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const firstReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      // 시간 간격을 두어 생성 순서를 명확히 함
      await new Promise((resolve) => setTimeout(resolve, 20));

      const secondReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({ placeIdx: place.idx, page: 1, orderBy: 'time', order: 'asc' })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const { reviewList }: GetAllReviewResponseDto = response.body;

      expect(reviewList[0].idx).toBe(firstReview.idx);
      expect(reviewList[1].idx).toBe(secondReview.idx);
    });

    it('200 - sort order desc check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const firstReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      // 시간 간격을 두어 생성 순서를 명확히 함
      await new Promise((resolve) => setTimeout(resolve, 20));

      const secondReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({ placeIdx: place.idx, page: 1, orderBy: 'time', order: 'desc' })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const { reviewList }: GetAllReviewResponseDto = response.body;

      expect(reviewList[0].idx).toBe(secondReview.idx);
      expect(reviewList[1].idx).toBe(firstReview.idx);
    });

    it('200 - soft delete check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // 삭제된 리뷰 생성
      await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
        deletedAt: new Date(),
      });

      const reviewToKeep = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: user.idx,
      });

      const response = await testHelper
        .test()
        .get('/review/all')
        .query({ placeIdx: place.idx, page: 1 })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const { reviewList }: GetAllReviewResponseDto = response.body;

      expect(reviewList[0].idx).toBe(reviewToKeep.idx);
    });

    it('200 - place idx filtering check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const [firstPlace, secondPlace] = await placeSeedHelper.seedAll([
        { deletedAt: null, activatedAt: new Date() },
        { deletedAt: null, activatedAt: new Date() },
      ]);

      const [
        review1OfFirstPlace,
        review2OfFirstPlace,
        review3OfSecondPlace,
        review4OfSecondPlace,
      ] = await reviewSeedHelper.seedAll([
        { placeIdx: firstPlace.idx, userIdx: user.idx },
        { placeIdx: firstPlace.idx, userIdx: user.idx },
        { placeIdx: secondPlace.idx, userIdx: user.idx },
        { placeIdx: secondPlace.idx, userIdx: user.idx },
      ]);

      const firstPlaceResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: firstPlace.idx,
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const reviewsOfFirstPlace = (
        firstPlaceResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfFirstPlace.map(({ idx }) => idx).sort()).toStrictEqual(
        [review1OfFirstPlace.idx, review2OfFirstPlace.idx].sort(),
      );

      const secondPlaceResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: secondPlace.idx,
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const reviewsOfSecondPlace = (
        secondPlaceResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfSecondPlace.map(({ idx }) => idx).sort()).toStrictEqual(
        [review3OfSecondPlace.idx, review4OfSecondPlace.idx].sort(),
      );
    });

    it('200 - user idx filtering check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const firstUser = await userSeedHelper.seed({
        nickname: 'testUser',
        profileImagePath: '/profile/testUser.png',
      });

      const secondUser = await userSeedHelper.seed({
        nickname: 'testUser2',
        profileImagePath: '/profile/testUser2.png',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const [
        review1OfFirstUser,
        review2OfFirstUser,
        review3OfSecondUser,
        review4OfSecondUser,
      ] = await reviewSeedHelper.seedAll([
        { placeIdx: place.idx, userIdx: firstUser.idx },
        { placeIdx: place.idx, userIdx: firstUser.idx },
        { placeIdx: place.idx, userIdx: secondUser.idx },
        { placeIdx: place.idx, userIdx: secondUser.idx },
      ]);

      const firstUserResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          userIdx: firstUser.idx,
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const reviewsOfFirstUser = (
        firstUserResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfFirstUser.map(({ idx }) => idx).sort()).toStrictEqual(
        [review1OfFirstUser.idx, review2OfFirstUser.idx].sort(),
      );

      const secondUserResponse = await testHelper
        .test()
        .get('/review/all')
        .query({
          userIdx: secondUser.idx,
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const reviewsOfSecondUser = (
        secondUserResponse.body as GetAllReviewResponseDto
      ).reviewList;

      expect(reviewsOfSecondUser.map(({ idx }) => idx).sort()).toStrictEqual(
        [review3OfSecondUser.idx, review4OfSecondUser.idx].sort(),
      );
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/review/all')
        .query({
          placeIdx: 'invalid', // ! invalid place idx
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - invalid user idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/review/all')
        .query({
          userIdx: 'invalid', // ! invalid place idx
          page: 1,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('200 - no placeIdx and no userIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/review/all')
        .query({
          page: 1, // ! no placeIdx and no userIdx
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);
    });
  });

  describe('POST /place/:placeIdx', () => {
    it('201 - should create a review for a managed user', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const managedUser = await managedUserSeedHelper.seed({
        nickname: 'reviewWriter',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const dto: CreateReviewDto = {
        userIdx: managedUser.idx,
        content: '정말 맛있는 곳이에요!',
        imagePathList: ['/review/sample-image.jpg'],
        keywordIdxList: [1],
      };

      const response = await testHelper
        .test()
        .post(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(201);

      const body = response.body as ReviewEntity;

      expect(body.idx).toBeDefined();
      expect(body.content).toBe(dto.content);
      expect(body.imagePathList).toStrictEqual(dto.imagePathList);
      expect(body.keywordList.map(({ idx }) => idx)).toStrictEqual(
        dto.keywordIdxList,
      );
      expect(body.author.idx).toBe(managedUser.idx);
      expect(body.place.idx).toBe(place.idx);
    });

    it('401 - no access token provided', async () => {
      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const dto: CreateReviewDto = {
        userIdx: 1,
        content: '토큰 없이 요청',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper.test().post(`/place/${place.idx}`).send(dto).expect(401);
    });

    it('403 - request with just admin permission (not SuperAdmin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const managedUser = await managedUserSeedHelper.seed({});

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const dto: CreateReviewDto = {
        userIdx: managedUser.idx,
        content: '어드민 권한으로 요청',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(403);
    });

    it('403 - userIdx is not a managed user', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      // social(userProvider)이 있는 일반 유저 → managed user가 아님
      const standardUser = await userSeedHelper.seed({
        nickname: 'standardUser',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const dto: CreateReviewDto = {
        userIdx: standardUser.idx,
        content: '일반 유저로 리뷰 생성 시도',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(403);
    });

    it('404 - place does not exist', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const managedUser = await managedUserSeedHelper.seed({});
      const nonExistentPlaceIdx = 99999;

      const dto: CreateReviewDto = {
        userIdx: managedUser.idx,
        content: '존재하지 않는 장소에 리뷰',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(404);
    });

    it('400 - content is too short (less than 3 chars)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const managedUser = await managedUserSeedHelper.seed({});

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const dto = {
        userIdx: managedUser.idx,
        content: 'ab', // ! 3자 미만
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });

    it('400 - imagePathList exceeds max size (5)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const managedUser = await managedUserSeedHelper.seed({});

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const dto = {
        userIdx: managedUser.idx,
        content: '이미지가 5개를 초과합니다',
        imagePathList: [
          '/review/img1.jpg',
          '/review/img2.jpg',
          '/review/img3.jpg',
          '/review/img4.jpg',
          '/review/img5.jpg',
          '/review/img6.jpg', // ! 6개
        ],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });

    it('400 - invalid placeIdx type', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const dto: CreateReviewDto = {
        userIdx: 1,
        content: '잘못된 placeIdx 타입',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .post('/place/invalid')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });
  });

  describe('PUT /review/:idx', () => {
    it('200 - should update a review written by a managed user', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const managedUser = await managedUserSeedHelper.seed({
        nickname: 'managedWriter',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const originalReview = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: managedUser.idx,
        content: '원본 리뷰 내용입니다.',
        reviewImgList: ['/review/original.jpg'],
        keywordIdxList: [1],
      });

      const dto: UpdateReviewDto = {
        content: '수정된 리뷰 내용입니다.',
        imagePathList: ['/review/updated.jpg'],
        keywordIdxList: [2],
      };

      await testHelper
        .test()
        .put(`/review/${originalReview.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(200);

      // 수정 반영 확인
      const updatedReview = await testHelper
        .getPrisma()
        .review.findUniqueOrThrow({
          where: { idx: originalReview.idx },
        });

      expect(updatedReview.content).toBe(dto.content);
    });

    it('401 - no access token provided', async () => {
      const managedUser = await managedUserSeedHelper.seed({});

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: managedUser.idx,
        content: '원본 리뷰 내용입니다.',
        reviewImgList: [],
        keywordIdxList: [1],
      });

      const dto: UpdateReviewDto = {
        content: '토큰 없이 수정 시도',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${review.idx}`)
        .send(dto)
        .expect(401);
    });

    it('403 - request with just admin permission (not SuperAdmin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const managedUser = await managedUserSeedHelper.seed({});

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: managedUser.idx,
        content: '원본 리뷰 내용입니다.',
        reviewImgList: [],
        keywordIdxList: [1],
      });

      const dto: UpdateReviewDto = {
        content: '어드민 권한으로 수정 시도',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${review.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(403);
    });

    it('403 - review author is not a managed user', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      // social 유저 → managed user가 아님
      const standardUser = await userSeedHelper.seed({
        nickname: 'standardWriter',
      });

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: standardUser.idx,
        content: '일반 유저가 작성한 리뷰입니다.',
        reviewImgList: [],
        keywordIdxList: [1],
      });

      const dto: UpdateReviewDto = {
        content: '수정 시도합니다.',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${review.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(403);
    });

    it('404 - review does not exist', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const nonExistentIdx = 99999;

      const dto: UpdateReviewDto = {
        content: '존재하지 않는 리뷰 수정 시도',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${nonExistentIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(404);
    });

    it('400 - content is too short (less than 3 chars)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const managedUser = await managedUserSeedHelper.seed({});

      const place = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        placeIdx: place.idx,
        userIdx: managedUser.idx,
        content: '원본 내용입니다.',
        reviewImgList: [],
        keywordIdxList: [1],
      });

      const dto = {
        content: 'ab', // ! 3자 미만
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put(`/review/${review.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });

    it('400 - invalid review idx type', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const dto: UpdateReviewDto = {
        content: '잘못된 idx 타입',
        imagePathList: [],
        keywordIdxList: [],
      };

      await testHelper
        .test()
        .put('/review/invalid')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });
  });
});
