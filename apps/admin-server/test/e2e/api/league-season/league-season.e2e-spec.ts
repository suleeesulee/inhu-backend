import { AdminServerModule } from '@admin/admin-server.module';
import { LeagueSeasonEntity } from '@admin/api/league-season/entity/league-season.entity';
import { LeagueSeasonOverviewEntity } from '@admin/api/league-season/entity/league-season-overview.entity';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { LeagueSeasonSeedHelper } from '@libs/testing/seed/league-season/league-season.seed';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceVisitSeedHelper } from '@libs/testing/seed/place-visit/place-visit.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { RewardSeedHelper } from '@libs/testing/seed/reward/reward.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { TestHelper } from '../../setup/test.helper';

describe('League Season E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const rewardSeedHelper = testHelper.seedHelper(RewardSeedHelper);
  const leagueSeasonSeedHelper = testHelper.seedHelper(LeagueSeasonSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);
  const placeVisitSeedHelper = testHelper.seedHelper(PlaceVisitSeedHelper);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /league-season/all', () => {
    it('200 - field check without activated filter', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [activatedLeagueSeason, deactivatedLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            name: '활성화된 1월 리그',
            startAt: new Date('2026-01-01T00:00:00.000Z'),
            endAt: new Date('2026-01-15T23:59:59.999Z'),
            activatedAt: new Date('2025-12-31T00:00:00.000Z'),
            finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
          },
          {
            name: '비활성화된 2월 리그',
            startAt: new Date('2026-02-01T00:00:00.000Z'),
            endAt: new Date('2026-02-15T23:59:59.999Z'),
            activatedAt: null,
            finalizedAt: null,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const leagueSeasonOverviewList: LeagueSeasonOverviewEntity[] =
        response.body.leagueSeasonOverviewList;

      expect(response.body.count).toBe(2);
      expect(leagueSeasonOverviewList).toHaveLength(2);
      expect(leagueSeasonOverviewList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            idx: activatedLeagueSeason.idx,
            name: activatedLeagueSeason.name,
            finalizedAt: activatedLeagueSeason.finalizedAt?.toISOString(),
          }),
          expect.objectContaining({
            idx: deactivatedLeagueSeason.idx,
            name: deactivatedLeagueSeason.name,
            activatedAt: null,
            finalizedAt: null,
          }),
        ]),
      );
    });

    it('200 - activated filter check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [activatedLeagueSeason, deactivatedLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            name: '활성화 필터 대상 리그',
            startAt: new Date('2026-03-01T00:00:00.000Z'),
            endAt: new Date('2026-03-15T23:59:59.999Z'),
            activatedAt: new Date(),
          },
          {
            name: '비활성화 필터 대상 리그',
            startAt: new Date('2026-04-01T00:00:00.000Z'),
            endAt: new Date('2026-04-15T23:59:59.999Z'),
            activatedAt: null,
          },
        ]);

      const activatedResponse = await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: true })
        .expect(200);
      const deactivatedResponse = await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: false })
        .expect(200);

      expect(activatedResponse.body.leagueSeasonOverviewList).toHaveLength(1);
      expect(activatedResponse.body.leagueSeasonOverviewList[0].idx).toBe(
        activatedLeagueSeason.idx,
      );
      expect(deactivatedResponse.body.leagueSeasonOverviewList).toHaveLength(1);
      expect(deactivatedResponse.body.leagueSeasonOverviewList[0].idx).toBe(
        deactivatedLeagueSeason.idx,
      );
    });

    it('200 - order check uses league season start date', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [earlierLeagueSeason, laterLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            name: '먼저 시작한 리그',
            startAt: new Date('2026-05-01T00:00:00.000Z'),
            endAt: new Date('2026-05-07T23:59:59.999Z'),
          },
          {
            name: '나중에 시작한 리그',
            startAt: new Date('2026-05-08T00:00:00.000Z'),
            endAt: new Date('2026-05-14T23:59:59.999Z'),
          },
        ]);

      const ascendingResponse = await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'asc' })
        .expect(200);
      const descendingResponse = await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'desc' })
        .expect(200);

      expect(ascendingResponse.body.leagueSeasonOverviewList[0].idx).toBe(
        earlierLeagueSeason.idx,
      );
      expect(descendingResponse.body.leagueSeasonOverviewList[0].idx).toBe(
        laterLeagueSeason.idx,
      );
    });

    it('200 - pagination check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      await leagueSeasonSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => {
          const startAt = new Date(Date.UTC(2026, 6, index + 1, 0, 0, 0, 0));
          const endAt = new Date(Date.UTC(2026, 6, index + 1, 23, 59, 59, 999));

          return {
            name: `페이지 리그 ${index + 1}`,
            startAt,
            endAt,
          };
        }),
      );

      const firstPageResponse = await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 2 })
        .expect(200);

      expect(firstPageResponse.body.count).toBe(11);
      expect(firstPageResponse.body.leagueSeasonOverviewList).toHaveLength(10);
      expect(secondPageResponse.body.count).toBe(11);
      expect(secondPageResponse.body.leagueSeasonOverviewList).toHaveLength(1);
    });

    it('200 - returns empty list when league seasons do not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(response.body.count).toBe(0);
      expect(response.body.leagueSeasonOverviewList).toEqual([]);
    });

    it('400 - page is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('400 - activated is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: 'invalid-activated' })
        .expect(400);
    });

    it('400 - order is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'invalid-order' })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .get('/league-season/all')
        .query({ page: 1 })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/league-season/all')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .query({ page: 1 })
        .expect(403);
    });
  });

  describe('GET /league-season/:idx', () => {
    it('200 - field and multiple reward option check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [firstReward, secondReward] = await rewardSeedHelper.seedAll([
        { name: '1등 스타벅스', activatedAt: new Date() },
        { name: '1등 배민', activatedAt: new Date() },
      ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '상세 조회 리그',
        startAt: new Date('2026-08-01T00:00:00.000Z'),
        endAt: new Date('2026-08-14T23:59:59.999Z'),
        activatedAt: new Date('2026-07-31T00:00:00.000Z'),
        finalizedAt: new Date('2026-08-15T00:00:00.000Z'),
        rewardOptionList: [
          { rewardIdx: firstReward.idx, targetRank: 1 },
          { rewardIdx: secondReward.idx, targetRank: 1 },
        ],
      });

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const responseLeagueSeason: LeagueSeasonEntity = response.body;

      expect(responseLeagueSeason.idx).toBe(leagueSeason.idx);
      expect(responseLeagueSeason.name).toBe(leagueSeason.name);
      expect(responseLeagueSeason.startAt).toBe(
        leagueSeason.startAt.toISOString(),
      );
      expect(responseLeagueSeason.endAt).toBe(leagueSeason.endAt.toISOString());
      expect(responseLeagueSeason.activatedAt).toBe(
        leagueSeason.activatedAt?.toISOString(),
      );
      expect(responseLeagueSeason.finalizedAt).toBe(
        leagueSeason.finalizedAt?.toISOString(),
      );
      expect(responseLeagueSeason.participantCount).toBe(0);
      expect(responseLeagueSeason.rewardOptionList).toHaveLength(2);
      expect(
        responseLeagueSeason.rewardOptionList.map(
          (option) => option.reward.idx,
        ),
      ).toEqual(expect.arrayContaining([firstReward.idx, secondReward.idx]));
      expect(
        responseLeagueSeason.rewardOptionList.map(
          (option) => option.targetRank,
        ),
      ).toEqual([1, 1]);
    });

    it('200 - excludes deleted reward option', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [visibleReward, deletedOptionReward] =
        await rewardSeedHelper.seedAll([
          { name: '유지되는 리워드' },
          { name: '삭제된 옵션 리워드' },
        ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-09-01T00:00:00.000Z'),
        endAt: new Date('2026-09-07T23:59:59.999Z'),
        rewardOptionList: [
          { rewardIdx: visibleReward.idx, targetRank: 1 },
          {
            rewardIdx: deletedOptionReward.idx,
            targetRank: 2,
            deletedAt: new Date('2026-09-08T00:00:00.000Z'),
          },
        ],
      });

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.rewardOptionList).toHaveLength(1);
      expect(response.body.rewardOptionList[0].reward.idx).toBe(
        visibleReward.idx,
      );
    });

    it('200 - count distinct participants only within league season period', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [firstUser, secondUser, deletedVisitUser] =
        await userSeedHelper.seedAll([{}, {}, {}]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-09-01T00:00:00.000Z'),
        endAt: new Date('2026-09-07T23:59:59.999Z'),
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: new Date('2026-08-31T00:00:00.000Z'),
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt: new Date('2026-08-31T00:00:00.000Z'),
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: firstUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: leagueSeason.startAt,
        },
        {
          userIdx: firstUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date('2026-09-04T12:00:00.000Z'),
        },
        {
          userIdx: secondUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: leagueSeason.endAt,
        },
        {
          userIdx: secondUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date(leagueSeason.endAt.getTime() + 1),
        },
        {
          userIdx: deletedVisitUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date('2026-09-05T12:00:00.000Z'),
          deletedAt: new Date('2026-09-08T00:00:00.000Z'),
        },
      ]);

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.participantCount).toBe(2);
    });

    it('400 - league season idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/invalid-league-season-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().get('/league-season/1').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/league-season/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - league season does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });

  describe('POST /league-season', () => {
    it('201 - creates inactive league season without reward options', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .post('/league-season')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '2026년 10월 첫 번째 리그',
          startAt: '2026-10-01',
          endAt: '2026-10-14',
        })
        .expect(201);

      const leagueSeason: LeagueSeasonEntity = response.body;

      expect(leagueSeason.idx).toBeDefined();
      expect(leagueSeason.name).toBe('2026년 10월 첫 번째 리그');
      expect(leagueSeason.startAt).toBe('2026-10-01T00:00:00.000Z');
      expect(leagueSeason.endAt).toBe('2026-10-14T23:59:59.000Z');
      expect(leagueSeason.activatedAt).toBeNull();
      expect(leagueSeason.finalizedAt).toBeNull();
      expect(leagueSeason.participantCount).toBe(0);
      expect(leagueSeason.rewardOptionList).toStrictEqual([]);
    });

    it('201 - creates one-day league season with inclusive start and end boundaries', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .post('/league-season')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '하루짜리 리그',
          startAt: '2026-11-11',
          endAt: '2026-11-11',
        })
        .expect(201);

      expect(response.body.startAt).toBe('2026-11-11T00:00:00.000Z');
      expect(response.body.endAt).toBe('2026-11-11T23:59:59.000Z');
    });

    it('400 - start date is after end date', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/league-season')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '역전된 기간 리그',
          startAt: '2026-12-15',
          endAt: '2026-12-14',
        })
        .expect(400);
    });

    it('400 - league season date format is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/league-season')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '잘못된 날짜 리그',
          startAt: '2026-12-32',
          endAt: '2026-12-31',
        })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .post('/league-season')
        .send({
          name: '인증 없는 리그',
          startAt: '2026-12-01',
          endAt: '2026-12-14',
        })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/league-season')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({
          name: '권한 없는 리그',
          startAt: '2026-12-01',
          endAt: '2026-12-14',
        })
        .expect(403);
    });
  });

  describe('POST /league-season/:idx/reward-option', () => {
    it('201 - creates multiple reward options for league season', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        rewardOptionList: null,
      });
      const [firstReward, secondReward, thirdReward] =
        await rewardSeedHelper.seedAll([
          { name: '1등 선택 상품 A' },
          { name: '1등 선택 상품 B' },
          { name: '2등 상품' },
        ]);

      await testHelper
        .test()
        .post(`/league-season/${leagueSeason.idx}/reward-option`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          rewardOptionList: [
            { rewardIdx: firstReward.idx, targetRank: 1 },
            { rewardIdx: secondReward.idx, targetRank: 1 },
            { rewardIdx: thirdReward.idx, targetRank: 2 },
          ],
        })
        .expect(201);

      const rewardOptionList = await testHelper
        .getPrisma()
        .leagueRewardOption.findMany({
          where: { leagueSeasonIdx: leagueSeason.idx },
        });

      expect(rewardOptionList).toHaveLength(3);
      expect(
        rewardOptionList.map(({ rewardIdx, targetRank }) => ({
          rewardIdx,
          targetRank,
        })),
      ).toEqual(
        expect.arrayContaining([
          { rewardIdx: firstReward.idx, targetRank: 1 },
          { rewardIdx: secondReward.idx, targetRank: 1 },
          { rewardIdx: thirdReward.idx, targetRank: 2 },
        ]),
      );
    });

    it('400 - league season idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/league-season/invalid-league-season-idx/reward-option')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ rewardOptionList: [] })
        .expect(400);
    });

    it('400 - reward option target rank is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({});
      const reward = await rewardSeedHelper.seed({});

      await testHelper
        .test()
        .post(`/league-season/${leagueSeason.idx}/reward-option`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          rewardOptionList: [{ rewardIdx: reward.idx, targetRank: 0 }],
        })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .post('/league-season/1/reward-option')
        .send({ rewardOptionList: [] })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/league-season/1/reward-option')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({ rewardOptionList: [] })
        .expect(403);
    });

    it('404 - league season does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/league-season/999999/reward-option')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ rewardOptionList: [] })
        .expect(404);
    });
  });

  describe('PUT /league-season/:idx/reward-option', () => {
    it('200 - replaces existing reward options', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [oldReward, firstReward, secondReward] =
        await rewardSeedHelper.seedAll([
          { name: '교체 전 상품' },
          { name: '교체 후 상품 A' },
          { name: '교체 후 상품 B' },
        ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        rewardOptionList: [{ rewardIdx: oldReward.idx, targetRank: 1 }],
      });

      await testHelper
        .test()
        .put(`/league-season/${leagueSeason.idx}/reward-option`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          rewardOptionList: [
            { rewardIdx: firstReward.idx, targetRank: 1 },
            { rewardIdx: secondReward.idx, targetRank: 2 },
          ],
        })
        .expect(200);

      const rewardOptionList = await testHelper
        .getPrisma()
        .leagueRewardOption.findMany({
          where: { leagueSeasonIdx: leagueSeason.idx },
        });

      expect(rewardOptionList).toHaveLength(2);
      expect(
        rewardOptionList.map(({ rewardIdx, targetRank }) => ({
          rewardIdx,
          targetRank,
        })),
      ).toEqual(
        expect.arrayContaining([
          { rewardIdx: firstReward.idx, targetRank: 1 },
          { rewardIdx: secondReward.idx, targetRank: 2 },
        ]),
      );
      expect(
        rewardOptionList.some(({ rewardIdx }) => rewardIdx === oldReward.idx),
      ).toBe(false);
    });

    it('400 - league season idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/league-season/invalid-league-season-idx/reward-option')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ rewardOptionList: [] })
        .expect(400);
    });

    it('400 - reward option target rank is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({});
      const reward = await rewardSeedHelper.seed({});

      await testHelper
        .test()
        .put(`/league-season/${leagueSeason.idx}/reward-option`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          rewardOptionList: [{ rewardIdx: reward.idx, targetRank: 0 }],
        })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .put('/league-season/1/reward-option')
        .send({ rewardOptionList: [] })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .put('/league-season/1/reward-option')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({ rewardOptionList: [] })
        .expect(403);
    });

    it('404 - league season does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/league-season/999999/reward-option')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ rewardOptionList: [] })
        .expect(404);
    });
  });

  describe('PUT /league-season/:idx', () => {
    it('200 - updates period boundaries and replaces reward option list', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [oldReward, newFirstReward, newSecondReward] =
        await rewardSeedHelper.seedAll([
          { name: '기존 리워드' },
          { name: '변경 리워드 1' },
          { name: '변경 리워드 2' },
        ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '수정 전 리그',
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-14T23:59:59.999Z'),
        rewardOptionList: [{ rewardIdx: oldReward.idx, targetRank: 1 }],
      });

      await testHelper
        .test()
        .put(`/league-season/${leagueSeason.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '수정 후 리그',
          startAt: '2026-02-01',
          endAt: '2026-02-28',
          rewardOptionList: [
            { rewardIdx: newFirstReward.idx, targetRank: 1 },
            { rewardIdx: newSecondReward.idx, targetRank: 2 },
          ],
        })
        .expect(200);

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.name).toBe('수정 후 리그');
      expect(response.body.startAt).toBe('2026-02-01T00:00:00.000Z');
      expect(response.body.endAt).toBe('2026-02-28T23:59:59.000Z');
      expect(response.body.rewardOptionList).toHaveLength(2);
      expect(
        response.body.rewardOptionList.map(
          (option: { reward: { idx: number } }) => option.reward.idx,
        ),
      ).toEqual(
        expect.arrayContaining([newFirstReward.idx, newSecondReward.idx]),
      );
      expect(
        response.body.rewardOptionList.some(
          (option: { reward: { idx: number } }) =>
            option.reward.idx === oldReward.idx,
        ),
      ).toBe(false);
    });

    it('200 - updates league season to one-day period boundaries', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '기간 변경 전 리그',
        startAt: new Date('2026-06-01T00:00:00.000Z'),
        endAt: new Date('2026-06-14T23:59:59.999Z'),
      });

      await testHelper
        .test()
        .put(`/league-season/${leagueSeason.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '기간 변경 후 하루 리그',
          startAt: '2026-06-15',
          endAt: '2026-06-15',
          rewardOptionList: [],
        })
        .expect(200);

      const savedLeagueSeason = await testHelper
        .getPrisma()
        .leagueSeason.findUniqueOrThrow({
          where: { idx: leagueSeason.idx },
        });

      expect(savedLeagueSeason.startAt.toISOString()).toBe(
        '2026-06-15T00:00:00.000Z',
      );
      expect(savedLeagueSeason.endAt.toISOString()).toBe(
        '2026-06-15T23:59:59.000Z',
      );
    });

    it('400 - invalid updated period does not change existing league season', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '유지되어야 하는 리그',
        startAt: new Date('2026-03-01T00:00:00.000Z'),
        endAt: new Date('2026-03-14T23:59:59.999Z'),
      });

      await testHelper
        .test()
        .put(`/league-season/${leagueSeason.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '변경되면 안 되는 리그',
          startAt: '2026-04-15',
          endAt: '2026-04-14',
          rewardOptionList: [],
        })
        .expect(400);

      const savedLeagueSeason = await testHelper
        .getPrisma()
        .leagueSeason.findUniqueOrThrow({
          where: { idx: leagueSeason.idx },
        });

      expect(savedLeagueSeason.name).toBe(leagueSeason.name);
      expect(savedLeagueSeason.startAt).toEqual(leagueSeason.startAt);
      expect(savedLeagueSeason.endAt).toEqual(leagueSeason.endAt);
    });

    it('400 - league season idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/league-season/invalid-league-season-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '수정 리그',
          startAt: '2026-05-01',
          endAt: '2026-05-14',
          rewardOptionList: [],
        })
        .expect(400);
    });

    it('400 - league season date format is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({});

      await testHelper
        .test()
        .put(`/league-season/${leagueSeason.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '잘못된 날짜 수정',
          startAt: '2026-05-01T00:00:00Z',
          endAt: '2026-05-14',
          rewardOptionList: [],
        })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .put('/league-season/1')
        .send({
          name: '인증 없는 수정',
          startAt: '2026-05-01',
          endAt: '2026-05-14',
          rewardOptionList: [],
        })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .put('/league-season/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({
          name: '권한 없는 수정',
          startAt: '2026-05-01',
          endAt: '2026-05-14',
          rewardOptionList: [],
        })
        .expect(403);
    });

    it('404 - league season does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/league-season/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          name: '없는 리그 수정',
          startAt: '2026-05-01',
          endAt: '2026-05-14',
          rewardOptionList: [],
        })
        .expect(404);
    });
  });

  describe('POST /league-season/:idx/activate', () => {
    it('200 - activates inactive league season', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        activatedAt: null,
      });
      const beforeRequest = new Date();

      await testHelper
        .test()
        .post(`/league-season/${leagueSeason.idx}/activate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const savedLeagueSeason = await testHelper
        .getPrisma()
        .leagueSeason.findUniqueOrThrow({
          where: { idx: leagueSeason.idx },
        });

      expect(savedLeagueSeason.activatedAt).not.toBeNull();
      expect(savedLeagueSeason.activatedAt?.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime(),
      );
    });

    it('400 - league season idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/league-season/invalid-league-season-idx/activate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().post('/league-season/1/activate').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/league-season/1/activate')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - league season does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/league-season/999999/activate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('409 - league season has already been activated', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/league-season/${leagueSeason.idx}/activate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(409);
    });
  });

  describe('POST /league-season/:idx/deactivate', () => {
    it('200 - deactivates active league season', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/league-season/${leagueSeason.idx}/deactivate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const savedLeagueSeason = await testHelper
        .getPrisma()
        .leagueSeason.findUniqueOrThrow({
          where: { idx: leagueSeason.idx },
        });

      expect(savedLeagueSeason.activatedAt).toBeNull();
    });

    it('400 - league season idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/league-season/invalid-league-season-idx/deactivate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().post('/league-season/1/deactivate').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/league-season/1/deactivate')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - league season does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/league-season/999999/deactivate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('409 - league season is not activated', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        activatedAt: null,
      });

      await testHelper
        .test()
        .post(`/league-season/${leagueSeason.idx}/deactivate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(409);
    });
  });
});
