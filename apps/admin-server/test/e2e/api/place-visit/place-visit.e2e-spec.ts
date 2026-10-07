import { AdminServerModule } from '@admin/admin-server.module';
import { PlaceVisitEntity } from '@admin/api/place-visit/entity/place-visit.entity';
import { LeagueSeasonResultSeedHelper } from '@libs/testing/seed/league-season/league-season-result.seed';
import { LeagueSeasonSeedHelper } from '@libs/testing/seed/league-season/league-season.seed';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceVisitSeedHelper } from '@libs/testing/seed/place-visit/place-visit.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { RewardSeedHelper } from '@libs/testing/seed/reward/reward.seed';
import { UserRewardSeedHelper } from '@libs/testing/seed/user-reward/user-reward.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { TestHelper } from '../../setup/test.helper';

describe('Place Visit E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);
  const placeVisitSeedHelper = testHelper.seedHelper(PlaceVisitSeedHelper);
  const leagueSeasonSeedHelper = testHelper.seedHelper(LeagueSeasonSeedHelper);
  const leagueSeasonResultSeedHelper = testHelper.seedHelper(
    LeagueSeasonResultSeedHelper,
  );
  const rewardSeedHelper = testHelper.seedHelper(RewardSeedHelper);
  const userRewardSeedHelper = testHelper.seedHelper(UserRewardSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /place-visit/all', () => {
    it('200 - field, user, place, and default descending order check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [firstUser, secondUser] = await userSeedHelper.seedAll([
        { nickname: '먼저 방문한 사용자' },
        { nickname: '나중에 방문한 사용자' },
      ]);
      const place = await placeSeedHelper.seed({
        name: '관리자 방문 조회 장소',
        roadAddress: {
          name: '인천광역시 미추홀구 인하로 100',
          addressX: 126.6531324,
          addressY: 37.4508371,
        },
        placeImgList: ['/place-image/admin-place-visit.png'],
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 7,
      });
      const [olderPlaceVisit, latestPlaceVisit] =
        await placeVisitSeedHelper.seedAll([
          {
            userIdx: firstUser.idx,
            nfcIdx: nfc.idx,
            score: 3,
            latitude: 37.4508371,
            longitude: 126.6531324,
            createdAt: new Date('2026-08-01T10:00:00.000Z'),
          },
          {
            userIdx: secondUser.idx,
            nfcIdx: nfc.idx,
            score: 7,
            latitude: 37.4511111,
            longitude: 126.6542222,
            createdAt: new Date('2026-08-02T10:00:00.000Z'),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);
      const placeVisitList: PlaceVisitEntity[] = response.body.placeVisitList;

      expect(response.body.count).toBe(2);
      expect(placeVisitList.map(({ id }) => id)).toStrictEqual([
        latestPlaceVisit.id,
        olderPlaceVisit.id,
      ]);
      expect(placeVisitList[0]).toEqual(
        expect.objectContaining({
          id: latestPlaceVisit.id,
          user: expect.objectContaining({
            idx: secondUser.idx,
            nickname: secondUser.nickname,
          }),
          nfcIdx: nfc.idx,
          score: 7,
          latitude: 37.4511111,
          longitude: 126.6542222,
          place: expect.objectContaining({
            idx: place.idx,
            name: place.name,
            imagePathList: place.placeImgList,
          }),
          createdAt: latestPlaceVisit.createdAt.toISOString(),
        }),
      );
      expect(placeVisitList[0]).not.toHaveProperty('userIdx');
      expect(placeVisitList[0]).not.toHaveProperty('deletedAt');
    });

    it('200 - place filter check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({ nickname: '장소 필터 사용자' });
      const [targetPlace, otherPlace] = await placeSeedHelper.seedAll([
        { name: '필터 대상 장소' },
        { name: '필터 제외 장소' },
      ]);
      const [targetNfc, otherNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: targetPlace.idx },
        { placeIdx: otherPlace.idx },
      ]);
      const [targetPlaceVisit, otherPlaceVisit] =
        await placeVisitSeedHelper.seedAll([
          { userIdx: user.idx, nfcIdx: targetNfc.idx },
          { userIdx: user.idx, nfcIdx: otherNfc.idx },
        ]);

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: targetPlace.idx })
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.placeVisitList).toHaveLength(1);
      expect(response.body.placeVisitList[0].id).toBe(targetPlaceVisit.id);
      expect(response.body.placeVisitList[0].id).not.toBe(otherPlaceVisit.id);
    });

    it('200 - return nullable coordinates', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({
        nickname: '좌표 없는 방문 사용자',
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const placeVisit = await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
        latitude: null,
        longitude: null,
      });

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, user: user.idx })
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.placeVisitList).toStrictEqual([
        expect.objectContaining({
          id: placeVisit.id,
          latitude: null,
          longitude: null,
        }),
      ]);
    });

    it('200 - user filter check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [targetUser, otherUser] = await userSeedHelper.seedAll([
        { nickname: '필터 대상 사용자' },
        { nickname: '필터 제외 사용자' },
      ]);
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const [targetUserPlaceVisit, otherUserPlaceVisit] =
        await placeVisitSeedHelper.seedAll([
          { userIdx: targetUser.idx, nfcIdx: nfc.idx },
          { userIdx: otherUser.idx, nfcIdx: nfc.idx },
        ]);

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, user: targetUser.idx })
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.placeVisitList).toHaveLength(1);
      expect(response.body.placeVisitList[0].id).toBe(targetUserPlaceVisit.id);
      expect(response.body.placeVisitList[0].id).not.toBe(
        otherUserPlaceVisit.id,
      );
    });

    it('200 - place and user filters are applied together', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [targetUser, otherUser] = await userSeedHelper.seedAll([
        { nickname: '복합 필터 대상 사용자' },
        { nickname: '복합 필터 제외 사용자' },
      ]);
      const [targetPlace, otherPlace] = await placeSeedHelper.seedAll([{}, {}]);
      const [targetNfc, otherNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: targetPlace.idx },
        { placeIdx: otherPlace.idx },
      ]);
      const [targetPlaceVisit] = await placeVisitSeedHelper.seedAll([
        { userIdx: targetUser.idx, nfcIdx: targetNfc.idx },
        { userIdx: targetUser.idx, nfcIdx: otherNfc.idx },
        { userIdx: otherUser.idx, nfcIdx: targetNfc.idx },
      ]);

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: targetPlace.idx, user: targetUser.idx })
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.placeVisitList).toHaveLength(1);
      expect(response.body.placeVisitList[0].id).toBe(targetPlaceVisit.id);
    });

    it('200 - excludes soft deleted place visits from list, count, and pagination', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({ nickname: '삭제 방문 사용자' });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const activePlaceVisitList = await placeVisitSeedHelper.seedAll(
        Array.from({ length: 10 }, (_, index) => ({
          userIdx: user.idx,
          nfcIdx: nfc.idx,
          createdAt: new Date(Date.UTC(2026, 7, index + 1)),
        })),
      );
      const deletedPlaceVisit = await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
        createdAt: new Date('2026-08-20T00:00:00.000Z'),
        deletedAt: new Date('2026-08-21T00:00:00.000Z'),
      });

      const firstPageResponse = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 2 })
        .expect(200);

      expect(firstPageResponse.body.count).toBe(10);
      expect(firstPageResponse.body.placeVisitList).toHaveLength(10);
      expect(
        (firstPageResponse.body.placeVisitList as PlaceVisitEntity[]).map(
          ({ id }) => id,
        ),
      ).toEqual(
        expect.arrayContaining(activePlaceVisitList.map(({ id }) => id)),
      );
      expect(
        (firstPageResponse.body.placeVisitList as PlaceVisitEntity[]).some(
          ({ id }) => id === deletedPlaceVisit.id,
        ),
      ).toBe(false);
      expect(secondPageResponse.body.count).toBe(10);
      expect(secondPageResponse.body.placeVisitList).toEqual([]);
    });

    it('200 - ascending order check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({ nickname: '정렬 사용자' });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const [olderPlaceVisit, latestPlaceVisit] =
        await placeVisitSeedHelper.seedAll([
          {
            userIdx: user.idx,
            nfcIdx: nfc.idx,
            createdAt: new Date('2026-08-01T00:00:00.000Z'),
          },
          {
            userIdx: user.idx,
            nfcIdx: nfc.idx,
            createdAt: new Date('2026-08-02T00:00:00.000Z'),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'asc' })
        .expect(200);

      expect(
        (response.body.placeVisitList as PlaceVisitEntity[]).map(
          ({ id }) => id,
        ),
      ).toStrictEqual([olderPlaceVisit.id, latestPlaceVisit.id]);
    });

    it('200 - pagination check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({ nickname: '페이지 사용자' });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      await placeVisitSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => ({
          userIdx: user.idx,
          nfcIdx: nfc.idx,
          createdAt: new Date(Date.UTC(2026, 7, index + 1)),
        })),
      );

      const firstPageResponse = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 2 })
        .expect(200);

      expect(firstPageResponse.body.count).toBe(11);
      expect(firstPageResponse.body.placeVisitList).toHaveLength(10);
      expect(secondPageResponse.body.count).toBe(11);
      expect(secondPageResponse.body.placeVisitList).toHaveLength(1);
    });

    it('200 - returns empty list when place visits do not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(response.body).toStrictEqual({
        count: 0,
        placeVisitList: [],
      });
    });

    it('400 - page is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('400 - page is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 0 })
        .expect(400);
    });

    it('400 - order is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'latest' })
        .expect(400);
    });

    it('400 - place is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: 0 })
        .expect(400);
    });

    it('400 - user is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, user: 0 })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 1 })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .query({ page: 1 })
        .expect(403);
    });
  });

  describe('DELETE /place-visit/:id', () => {
    it('200 - soft delete place visit and exclude it from lookup', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({ nickname: '삭제 대상 사용자' });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const placeVisit = await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
      });

      await testHelper
        .test()
        .delete(`/place-visit/${placeVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const deletedPlaceVisit = await testHelper
        .getPrisma()
        .placeVisit.findUnique({ where: { id: placeVisit.id } });
      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(deletedPlaceVisit).not.toBeNull();
      expect(deletedPlaceVisit?.deletedAt).not.toBeNull();
      expect(response.body.count).toBe(0);
      expect(response.body.placeVisitList).toEqual([]);
    });

    it('200 - delete before batch without creating league season result or user reward', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({
        nickname: '배치 전 삭제 사용자',
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-08-01T00:00:00.000Z'),
        endAt: new Date('2026-08-15T23:59:59.999Z'),
        activatedAt: new Date('2026-07-31T00:00:00.000Z'),
        finalizedAt: null,
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const placeVisit = await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
        score: 10,
        createdAt: new Date('2026-08-05T10:00:00.000Z'),
      });

      await testHelper
        .test()
        .delete(`/place-visit/${placeVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const leagueSeasonResultCount = await testHelper
        .getPrisma()
        .leagueSeasonResult.count({
          where: { leagueSeasonIdx: leagueSeason.idx },
        });
      const userRewardCount = await testHelper.getPrisma().userReward.count();

      expect(leagueSeasonResultCount).toBe(0);
      expect(userRewardCount).toBe(0);
    });

    it('200 - recalculate finalized score from remaining place visits', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({
        nickname: '점수 재계산 사용자',
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-06-01T00:00:00.000Z'),
        endAt: new Date('2026-06-15T23:59:59.999Z'),
        activatedAt: new Date('2026-05-31T00:00:00.000Z'),
        finalizedAt: new Date('2026-06-16T00:00:00.000Z'),
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const [remainingPlaceVisit, deletedPlaceVisit] =
        await placeVisitSeedHelper.seedAll([
          {
            userIdx: user.idx,
            nfcIdx: nfc.idx,
            score: 7,
            createdAt: new Date('2026-06-03T10:00:00.000Z'),
          },
          {
            userIdx: user.idx,
            nfcIdx: nfc.idx,
            score: 13,
            createdAt: new Date('2026-06-04T10:00:00.000Z'),
          },
        ]);
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
        finalScore: remainingPlaceVisit.score + deletedPlaceVisit.score,
      });

      await testHelper
        .test()
        .delete(`/place-visit/${deletedPlaceVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const updatedLeagueSeasonResult = await testHelper
        .getPrisma()
        .leagueSeasonResult.findUnique({
          where: { id: leagueSeasonResult.id },
        });

      expect(updatedLeagueSeasonResult?.finalScore).toBe(
        remainingPlaceVisit.score,
      );
    });

    it('200 - move unselected reward when deletion changes rank 10 to 11', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [previousTenthUser, previousEleventhUser] =
        await userSeedHelper.seedAll([
          { nickname: '기존 10위 사용자' },
          { nickname: '기존 11위 사용자' },
        ]);
      const reward = await rewardSeedHelper.seed({
        name: '10위 리워드',
        activatedAt: new Date('2026-04-01T00:00:00.000Z'),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-05-01T00:00:00.000Z'),
        endAt: new Date('2026-05-15T23:59:59.999Z'),
        activatedAt: new Date('2026-04-30T00:00:00.000Z'),
        finalizedAt: new Date('2026-05-16T00:00:00.000Z'),
        rewardOptionList: [{ rewardIdx: reward.idx, targetRank: 10 }],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const [deletedPlaceVisit] = await placeVisitSeedHelper.seedAll([
        {
          userIdx: previousTenthUser.idx,
          nfcIdx: nfc.idx,
          score: 11,
          createdAt: new Date('2026-05-01T10:00:00.000Z'),
        },
        {
          userIdx: previousEleventhUser.idx,
          nfcIdx: nfc.idx,
          score: 10,
          createdAt: new Date('2026-05-02T10:00:00.000Z'),
        },
      ]);
      const higherUserList = await userSeedHelper.seedAll(
        Array.from({ length: 9 }, (_, index) => ({
          nickname: `상위 ${index + 1}위 사용자`,
        })),
      );
      const higherPlaceVisitList = await placeVisitSeedHelper.seedAll(
        higherUserList.map((user, index) => ({
          userIdx: user.idx,
          nfcIdx: nfc.idx,
          score: 100 - index,
          createdAt: new Date(Date.UTC(2026, 4, index + 1, 9)),
        })),
      );
      const higherLeagueSeasonResultList =
        await leagueSeasonResultSeedHelper.seedAll(
          higherUserList.map((user, index) => ({
            leagueSeasonIdx: leagueSeason.idx,
            userIdx: user.idx,
            finalScore: higherPlaceVisitList[index].score,
          })),
        );
      const [previousTenthResult, previousEleventhResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          {
            leagueSeasonIdx: leagueSeason.idx,
            userIdx: previousTenthUser.idx,
            finalScore: 11,
          },
          {
            leagueSeasonIdx: leagueSeason.idx,
            userIdx: previousEleventhUser.idx,
            finalScore: 10,
          },
        ]);
      await userRewardSeedHelper.seed({
        leagueSeasonResultId: previousTenthResult.id,
      });

      await testHelper
        .test()
        .delete(`/place-visit/${deletedPlaceVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const userRewardList = await testHelper
        .getPrisma()
        .userReward.findMany({ orderBy: { leagueSeasonResultId: 'asc' } });

      expect(userRewardList).toHaveLength(1);
      expect(userRewardList[0].leagueSeasonResultId).toBe(
        previousEleventhResult.id,
      );
      expect(
        higherLeagueSeasonResultList.some(
          ({ id }) => id === userRewardList[0].leagueSeasonResultId,
        ),
      ).toBe(false);
    });

    it('200 - preserve selected reward even when user is no longer eligible', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({ nickname: '선택 완료 사용자' });
      const reward = await rewardSeedHelper.seed({
        name: '선택 완료 리워드',
        activatedAt: new Date('2026-02-01T00:00:00.000Z'),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-03-01T00:00:00.000Z'),
        endAt: new Date('2026-03-15T23:59:59.999Z'),
        activatedAt: new Date('2026-02-28T00:00:00.000Z'),
        finalizedAt: new Date('2026-03-16T00:00:00.000Z'),
        rewardOptionList: [{ rewardIdx: reward.idx, targetRank: 1 }],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const placeVisit = await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
        score: 10,
        createdAt: new Date('2026-03-05T10:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
        finalScore: 10,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date('2026-03-17T00:00:00.000Z'),
      });

      await testHelper
        .test()
        .delete(`/place-visit/${placeVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const preservedUserReward = await testHelper
        .getPrisma()
        .userReward.findUnique({ where: { id: userReward.id } });
      const updatedLeagueSeasonResult = await testHelper
        .getPrisma()
        .leagueSeasonResult.findUnique({
          where: { id: leagueSeasonResult.id },
        });

      expect(updatedLeagueSeasonResult?.finalScore).toBe(0);
      expect(preservedUserReward?.id).toBe(userReward.id);
      expect(preservedUserReward?.selectedAt).toEqual(userReward.selectedAt);
    });

    it('200 - preserve both unselected rewards when first and second ranks are reversed', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [previousFirstUser, previousSecondUser] =
        await userSeedHelper.seedAll([
          { nickname: '기존 1위 사용자' },
          { nickname: '기존 2위 사용자' },
        ]);
      const [firstReward, secondReward] = await rewardSeedHelper.seedAll([
        {
          name: '1위 리워드',
          activatedAt: new Date('2026-02-01T00:00:00.000Z'),
        },
        {
          name: '2위 리워드',
          activatedAt: new Date('2026-02-01T00:00:00.000Z'),
        },
      ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-03-01T00:00:00.000Z'),
        endAt: new Date('2026-03-15T23:59:59.999Z'),
        activatedAt: new Date('2026-02-28T00:00:00.000Z'),
        finalizedAt: new Date('2026-03-16T00:00:00.000Z'),
        rewardOptionList: [
          { rewardIdx: firstReward.idx, targetRank: 1 },
          { rewardIdx: secondReward.idx, targetRank: 2 },
        ],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const [remainingFirstVisit, deletedFirstVisit] =
        await placeVisitSeedHelper.seedAll([
          {
            userIdx: previousFirstUser.idx,
            nfcIdx: nfc.idx,
            score: 5,
            createdAt: new Date('2026-03-03T10:00:00.000Z'),
          },
          {
            userIdx: previousFirstUser.idx,
            nfcIdx: nfc.idx,
            score: 15,
            createdAt: new Date('2026-03-04T10:00:00.000Z'),
          },
        ]);
      await placeVisitSeedHelper.seed({
        userIdx: previousSecondUser.idx,
        nfcIdx: nfc.idx,
        score: 10,
        createdAt: new Date('2026-03-05T10:00:00.000Z'),
      });
      const [previousFirstResult, previousSecondResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          {
            leagueSeasonIdx: leagueSeason.idx,
            userIdx: previousFirstUser.idx,
            finalScore: 20,
          },
          {
            leagueSeasonIdx: leagueSeason.idx,
            userIdx: previousSecondUser.idx,
            finalScore: 10,
          },
        ]);
      const [previousFirstUserReward, previousSecondUserReward] =
        await userRewardSeedHelper.seedAll([
          { leagueSeasonResultId: previousFirstResult.id },
          { leagueSeasonResultId: previousSecondResult.id },
        ]);

      await testHelper
        .test()
        .delete(`/place-visit/${deletedFirstVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const leagueSeasonResultList = await testHelper
        .getPrisma()
        .leagueSeasonResult.findMany({
          where: { leagueSeasonIdx: leagueSeason.idx },
          orderBy: { finalScore: 'desc' },
        });
      const userRewardList = await testHelper.getPrisma().userReward.findMany({
        where: {
          leagueSeasonResultId: {
            in: [previousFirstResult.id, previousSecondResult.id],
          },
        },
      });

      expect(leagueSeasonResultList).toStrictEqual([
        expect.objectContaining({
          id: previousSecondResult.id,
          finalScore: 10,
        }),
        expect.objectContaining({
          id: previousFirstResult.id,
          finalScore: remainingFirstVisit.score,
        }),
      ]);
      expect(userRewardList.map(({ id }) => id)).toEqual(
        expect.arrayContaining([
          previousFirstUserReward.id,
          previousSecondUserReward.id,
        ]),
      );
      expect(userRewardList).toHaveLength(2);
    });

    it('200 - keep zero score result and delete unselected reward when the only visit is deleted', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({
        nickname: '유일한 방문 삭제 사용자',
      });
      const reward = await rewardSeedHelper.seed({
        name: '삭제 대상 미선택 리워드',
        activatedAt: new Date('2025-10-01T00:00:00.000Z'),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2025-11-01T00:00:00.000Z'),
        endAt: new Date('2025-11-15T23:59:59.999Z'),
        activatedAt: new Date('2025-10-31T00:00:00.000Z'),
        finalizedAt: new Date('2025-11-16T00:00:00.000Z'),
        rewardOptionList: [{ rewardIdx: reward.idx, targetRank: 1 }],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const placeVisit = await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
        score: 10,
        createdAt: new Date('2025-11-05T10:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
        finalScore: 10,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .delete(`/place-visit/${placeVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const updatedLeagueSeasonResult = await testHelper
        .getPrisma()
        .leagueSeasonResult.findUnique({
          where: { id: leagueSeasonResult.id },
        });
      const deletedUserReward = await testHelper
        .getPrisma()
        .userReward.findUnique({ where: { id: userReward.id } });

      expect(updatedLeagueSeasonResult?.finalScore).toBe(0);
      expect(deletedUserReward).toBeNull();
    });

    it('200 - preserve issued reward even when user is no longer eligible', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({ nickname: '발급 완료 사용자' });
      const reward = await rewardSeedHelper.seed({
        name: '발급 완료 리워드',
        activatedAt: new Date('2025-12-01T00:00:00.000Z'),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date('2025-12-31T00:00:00.000Z'),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
        rewardOptionList: [{ rewardIdx: reward.idx, targetRank: 1 }],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const placeVisit = await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
        score: 10,
        createdAt: new Date('2026-01-05T10:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
        finalScore: 10,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date('2026-01-17T00:00:00.000Z'),
        issuedAt: new Date('2026-01-18T00:00:00.000Z'),
      });

      await testHelper
        .test()
        .delete(`/place-visit/${placeVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const preservedUserReward = await testHelper
        .getPrisma()
        .userReward.findUnique({ where: { id: userReward.id } });

      expect(preservedUserReward?.id).toBe(userReward.id);
      expect(preservedUserReward?.issuedAt).toEqual(userReward.issuedAt);
    });

    it('400 - place visit id is not UUID', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/place-visit/not-uuid')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .delete('/place-visit/00000000-0000-4000-8000-000000000000')
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .delete('/place-visit/00000000-0000-4000-8000-000000000000')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - place visit does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/place-visit/00000000-0000-4000-8000-000000000000')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('404 - place visit has already been deleted', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({
        nickname: '이미 삭제된 사용자',
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      const placeVisit = await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
        deletedAt: new Date(),
      });

      await testHelper
        .test()
        .delete(`/place-visit/${placeVisit.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });
});
