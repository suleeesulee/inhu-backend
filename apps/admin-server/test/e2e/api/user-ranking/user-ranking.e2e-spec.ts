import { AdminServerModule } from '@admin/admin-server.module';
import { UserRankingEntity } from '@admin/api/user-ranking/entity/user-ranking.entity';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { LeagueSeasonResultSeedHelper } from '@libs/testing/seed/league-season/league-season-result.seed';
import { LeagueSeasonSeedHelper } from '@libs/testing/seed/league-season/league-season.seed';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceVisitSeedHelper } from '@libs/testing/seed/place-visit/place-visit.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { RewardSeedHelper } from '@libs/testing/seed/reward/reward.seed';
import { UserRewardSeedHelper } from '@libs/testing/seed/user-reward/user-reward.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { TestHelper } from '../../setup/test.helper';

describe('User Ranking E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);
  const leagueSeasonSeedHelper = testHelper.seedHelper(LeagueSeasonSeedHelper);
  const leagueSeasonResultSeedHelper = testHelper.seedHelper(
    LeagueSeasonResultSeedHelper,
  );
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);
  const placeVisitSeedHelper = testHelper.seedHelper(PlaceVisitSeedHelper);
  const rewardSeedHelper = testHelper.seedHelper(RewardSeedHelper);
  const userRewardSeedHelper = testHelper.seedHelper(UserRewardSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /league-season/:leagueSeasonIdx/user-ranking', () => {
    it('200 - field, ranking order, user, and user reward check', async () => {
      const [firstUser, secondUser] = await userSeedHelper.seedAll([
        { nickname: '랭킹 1위 사용자' },
        { nickname: '랭킹 2위 사용자' },
      ]);
      const reward = await rewardSeedHelper.seed({
        name: '1위 선택 리워드',
        activatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '관리자 랭킹 조회 리그',
        startAt: new Date('2026-02-01T00:00:00.000Z'),
        endAt: new Date('2026-02-15T23:59:59.000Z'),
        activatedAt: new Date('2026-01-15T00:00:00.000Z'),
        finalizedAt: new Date('2026-02-16T00:00:00.000Z'),
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: new Date('2026-01-15T00:00:00.000Z'),
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt: new Date('2026-01-15T00:00:00.000Z'),
      });
      const [firstVisit, secondVisit] = await placeVisitSeedHelper.seedAll([
        {
          userIdx: firstUser.idx,
          nfcIdx: nfc.idx,
          score: 20,
          createdAt: new Date('2026-02-03T10:00:00.000Z'),
        },
        {
          userIdx: secondUser.idx,
          nfcIdx: nfc.idx,
          score: 10,
          createdAt: new Date('2026-02-04T10:00:00.000Z'),
        },
      ]);
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: firstUser.idx,
        finalScore: 20,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date('2026-02-17T00:00:00.000Z'),
      });
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/user-ranking`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const userRankingList: UserRankingEntity[] =
        response.body.userRankingList;
      const firstUserRanking = userRankingList.find(
        ({ user }) => user.idx === firstUser.idx,
      );
      const secondUserRanking = userRankingList.find(
        ({ user }) => user.idx === secondUser.idx,
      );
      const userCount = await testHelper.getPrisma().user.count({
        where: { deletedAt: null },
      });

      expect(response.body.count).toBe(userCount);
      expect(firstUserRanking).toBeDefined();
      expect(firstUserRanking?.seasonRank).toBe(1);
      expect(firstUserRanking?.seasonScore).toBe(20);
      expect(firstUserRanking?.seasonLatestVisitAt).toBe(
        firstVisit.createdAt.toISOString(),
      );
      expect(firstUserRanking?.cumulativeRank).toBe(1);
      expect(firstUserRanking?.cumulativeScore).toBe(20);
      expect(firstUserRanking?.cumulativeLatestVisitAt).toBe(
        firstVisit.createdAt.toISOString(),
      );
      expect(firstUserRanking?.user.nickname).toBe(firstUser.nickname);
      expect(firstUserRanking?.userReward?.id).toBe(userReward.id);
      expect(firstUserRanking?.userReward?.reward?.idx).toBe(reward.idx);
      expect(firstUserRanking?.userReward?.reward?.name).toBe(reward.name);
      expect(firstUserRanking?.userReward?.user.idx).toBe(firstUser.idx);
      expect(secondUserRanking).toBeDefined();
      expect(secondUserRanking?.seasonRank).toBe(2);
      expect(secondUserRanking?.seasonScore).toBe(10);
      expect(secondUserRanking?.seasonLatestVisitAt).toBe(
        secondVisit.createdAt.toISOString(),
      );
      expect(secondUserRanking?.userReward).toBeNull();
    });

    it('200 - same score is ranked by who reached it first', async () => {
      const [firstUser, secondUser] = await userSeedHelper.seedAll([
        { nickname: '동점 선착 사용자' },
        { nickname: '동점 후착 사용자' },
      ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-03-01T00:00:00.000Z'),
        endAt: new Date('2026-03-15T23:59:59.000Z'),
        activatedAt: new Date('2026-02-15T00:00:00.000Z'),
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: new Date('2026-02-15T00:00:00.000Z'),
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt: new Date('2026-02-15T00:00:00.000Z'),
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: firstUser.idx,
          nfcIdx: nfc.idx,
          score: 10,
          createdAt: new Date('2026-03-03T09:00:00.000Z'),
        },
        {
          userIdx: secondUser.idx,
          nfcIdx: nfc.idx,
          score: 10,
          createdAt: new Date('2026-03-03T10:00:00.000Z'),
        },
      ]);
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/user-ranking`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const userRankingList: UserRankingEntity[] =
        response.body.userRankingList;

      expect(
        userRankingList.find(({ user }) => user.idx === firstUser.idx)
          ?.seasonRank,
      ).toBe(1);
      expect(
        userRankingList.find(({ user }) => user.idx === secondUser.idx)
          ?.seasonRank,
      ).toBe(2);
    });

    it('200 - count and pagination check', async () => {
      const userList = await userSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => ({
          nickname: `페이지 랭킹 사용자 ${index + 1}`,
        })),
      );
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-04-01T00:00:00.000Z'),
        endAt: new Date('2026-04-15T23:59:59.000Z'),
        activatedAt: new Date('2026-03-15T00:00:00.000Z'),
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: new Date('2026-03-15T00:00:00.000Z'),
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 1,
        activatedAt: new Date('2026-03-15T00:00:00.000Z'),
      });
      await placeVisitSeedHelper.seedAll(
        userList.map((user, index) => ({
          userIdx: user.idx,
          nfcIdx: nfc.idx,
          score: userList.length - index,
          createdAt: new Date(
            `2026-04-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
          ),
        })),
      );
      const admin = testHelper.loginAdmin.admin1;

      const firstPageResponse = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/user-ranking`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/user-ranking`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 2 })
        .expect(200);

      const count = await testHelper.getPrisma().user.count({
        where: { deletedAt: null },
      });
      const firstPageUserIdxList = firstPageResponse.body.userRankingList.map(
        ({ user }: UserRankingEntity) => user.idx,
      );
      const secondPageUserIdxList = secondPageResponse.body.userRankingList.map(
        ({ user }: UserRankingEntity) => user.idx,
      );

      expect(firstPageResponse.body.count).toBe(count);
      expect(secondPageResponse.body.count).toBe(count);
      expect(firstPageResponse.body.userRankingList).toHaveLength(10);
      expect(secondPageResponse.body.userRankingList).toHaveLength(
        Math.min(10, count - 10),
      );
      expect(
        firstPageUserIdxList.some((userIdx: number) =>
          secondPageUserIdxList.includes(userIdx),
        ),
      ).toBe(false);
    });

    it('200 - inactive league season has empty ranking', async () => {
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        activatedAt: null,
      });
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/user-ranking`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(response.body.count).toBe(0);
      expect(response.body.userRankingList).toStrictEqual([]);
    });

    it('400 - league season idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/invalid-league-season-idx/user-ranking')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(400);
    });

    it('400 - page is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/1/user-ranking')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('400 - page is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/1/user-ranking')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 0 })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .get('/league-season/1/user-ranking')
        .query({ page: 1 })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/league-season/1/user-ranking')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .query({ page: 1 })
        .expect(403);
    });

    it('404 - league season does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/league-season/999999/user-ranking')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(404);
    });
  });
});
