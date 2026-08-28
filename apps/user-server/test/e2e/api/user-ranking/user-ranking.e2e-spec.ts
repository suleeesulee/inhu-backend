import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { LeagueSeasonSeedHelper } from '@libs/testing/seed/league-season/league-season.seed';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceVisitSeedHelper } from '@libs/testing/seed/place-visit/place-visit.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { GetCumulativeRankingAllResponseDto } from '@user/api/user-ranking/dto/response/get-cumulative-ranking-all.response.dto';
import { GetSeasonRankingAllResponseDto } from '@user/api/user-ranking/dto/response/get-season-ranking-all.response.dto';
import { UserRankingOverviewEntity } from '@user/api/user-ranking/entity/user-ranking-overview.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from '../../setup/test.helper';

describe('User Ranking E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const leagueSeasonSeedHelper = testHelper.seedHelper(LeagueSeasonSeedHelper);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);
  const placeVisitSeedHelper = testHelper.seedHelper(PlaceVisitSeedHelper);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /league-season/:leagueSeasonIdx/season-ranking/all', () => {
    it('200 - season ranking field and period boundary check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const createdAt = new Date('2026-01-01T00:00:00.000Z');
      const activatedAt = new Date('2026-01-15T00:00:00.000Z');
      const startAt = new Date('2026-02-01T00:00:00.000Z');
      const endAt = new Date('2026-02-07T23:59:59.000Z');
      const deletedUser = await userSeedHelper.seed({
        nickname: 'deleted-ranking-user',
        deletedAt: new Date('2026-02-08T00:00:00.000Z'),
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [boundaryNfc, otherUserNfc, outsidePeriodNfc] =
        await nfcSeedHelper.seedAll([
          { placeIdx: place.idx, score: 10, activatedAt },
          { placeIdx: place.idx, score: 15, activatedAt },
          { placeIdx: place.idx, score: 100, activatedAt },
        ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Season Ranking Boundary League',
        createdAt,
        startAt,
        endAt,
        activatedAt,
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: outsidePeriodNfc.idx,
          score: outsidePeriodNfc.score,
          createdAt: new Date(startAt.getTime() - 1),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: boundaryNfc.idx,
          score: boundaryNfc.score,
          createdAt: startAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: boundaryNfc.idx,
          score: boundaryNfc.score,
          createdAt: endAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: outsidePeriodNfc.idx,
          score: outsidePeriodNfc.score,
          createdAt: new Date(endAt.getTime() + 1),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: otherUserNfc.idx,
          score: otherUserNfc.score,
          createdAt: new Date('2026-02-04T12:00:00.000Z'),
        },
        {
          userIdx: deletedUser.idx,
          nfcIdx: outsidePeriodNfc.idx,
          score: outsidePeriodNfc.score,
          createdAt: new Date('2026-02-03T12:00:00.000Z'),
        },
      ]);
      const [loginUserData, otherUserData] = await Promise.all([
        testHelper.getPrisma().user.findUniqueOrThrow({
          where: { idx: loginUser.idx },
        }),
        testHelper.getPrisma().user.findUniqueOrThrow({
          where: { idx: otherUser.idx },
        }),
      ]);

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/season-ranking/all`)
        .query({ page: 1 })
        .expect(200);

      const body: GetSeasonRankingAllResponseDto = response.body;

      expect(body.hasNext).toBe(false);
      expect(body.seasonUserRankingList).toHaveLength(2);
      expect(body.seasonUserRankingList[0]).toStrictEqual({
        userIdx: loginUser.idx,
        nickname: loginUserData.nickname,
        seasonRank: 1,
        seasonScore: 20,
        seasonLatestVisitAt: endAt.toISOString(),
      });
      expect(body.seasonUserRankingList[1]).toStrictEqual({
        userIdx: otherUser.idx,
        nickname: otherUserData.nickname,
        seasonRank: 2,
        seasonScore: 15,
        seasonLatestVisitAt: new Date('2026-02-04T12:00:00.000Z').toISOString(),
      });
      expect(
        body.seasonUserRankingList.some(
          ({ userIdx }) => userIdx === deletedUser.idx,
        ),
      ).toBe(false);
    });

    it('200 - selected league season is aggregated independently', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const activatedAt = new Date('2026-02-15T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [lowScoreNfc, highScoreNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, score: 10, activatedAt },
        { placeIdx: place.idx, score: 30, activatedAt },
      ]);
      const [firstLeagueSeason, secondLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            name: 'First Ranking League',
            createdAt: new Date('2026-02-01T00:00:00.000Z'),
            startAt: new Date('2026-03-01T00:00:00.000Z'),
            endAt: new Date('2026-03-07T23:59:59.000Z'),
            activatedAt,
          },
          {
            name: 'Second Ranking League',
            createdAt: new Date('2026-03-01T00:00:00.000Z'),
            startAt: new Date('2026-04-01T00:00:00.000Z'),
            endAt: new Date('2026-04-07T23:59:59.000Z'),
            activatedAt,
          },
        ]);
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: lowScoreNfc.idx,
          score: lowScoreNfc.score,
          createdAt: new Date('2026-03-03T12:00:00.000Z'),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: highScoreNfc.idx,
          score: highScoreNfc.score,
          createdAt: new Date('2026-03-04T12:00:00.000Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: highScoreNfc.idx,
          score: highScoreNfc.score,
          createdAt: new Date('2026-04-03T12:00:00.000Z'),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: lowScoreNfc.idx,
          score: lowScoreNfc.score,
          createdAt: new Date('2026-04-04T12:00:00.000Z'),
        },
      ]);

      const firstLeagueResponse = await testHelper
        .test()
        .get(`/league-season/${firstLeagueSeason.idx}/season-ranking/all`)
        .query({ page: 1 })
        .expect(200);
      const secondLeagueResponse = await testHelper
        .test()
        .get(`/league-season/${secondLeagueSeason.idx}/season-ranking/all`)
        .query({ page: 1 })
        .expect(200);

      const firstLeagueBody: GetSeasonRankingAllResponseDto =
        firstLeagueResponse.body;
      const secondLeagueBody: GetSeasonRankingAllResponseDto =
        secondLeagueResponse.body;

      expect(
        firstLeagueBody.seasonUserRankingList.map(
          ({ userIdx, seasonRank, seasonScore }) => ({
            userIdx,
            seasonRank,
            seasonScore,
          }),
        ),
      ).toStrictEqual([
        { userIdx: otherUser.idx, seasonRank: 1, seasonScore: 30 },
        { userIdx: loginUser.idx, seasonRank: 2, seasonScore: 10 },
      ]);
      expect(
        secondLeagueBody.seasonUserRankingList.map(
          ({ userIdx, seasonRank, seasonScore }) => ({
            userIdx,
            seasonRank,
            seasonScore,
          }),
        ),
      ).toStrictEqual([
        { userIdx: loginUser.idx, seasonRank: 1, seasonScore: 30 },
        { userIdx: otherUser.idx, seasonRank: 2, seasonScore: 10 },
      ]);
    });

    it('200 - same score is ranked by who reached it first and user idx', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const extraUser = await userSeedHelper.seed({
        nickname: 'same-score-extra-user',
      });
      const activatedAt = new Date('2026-04-15T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt,
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Same Score League',
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        startAt: new Date('2026-05-01T00:00:00.000Z'),
        endAt: new Date('2026-05-07T23:59:59.000Z'),
        activatedAt,
      });
      const firstReachedAt = new Date('2026-05-03T09:00:00.000Z');
      const sameReachedAt = new Date('2026-05-03T10:00:00.000Z');
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: otherUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: firstReachedAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: sameReachedAt,
        },
        {
          userIdx: extraUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: sameReachedAt,
        },
      ]);

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/season-ranking/all`)
        .query({ page: 1 })
        .expect(200);

      const body: GetSeasonRankingAllResponseDto = response.body;

      expect(loginUser.idx).toBeLessThan(extraUser.idx);
      expect(
        body.seasonUserRankingList.map(
          ({ userIdx, seasonRank, seasonLatestVisitAt }) => ({
            userIdx,
            seasonRank,
            seasonLatestVisitAt,
          }),
        ),
      ).toStrictEqual([
        {
          userIdx: otherUser.idx,
          seasonRank: 1,
          seasonLatestVisitAt: firstReachedAt.toISOString(),
        },
        {
          userIdx: loginUser.idx,
          seasonRank: 2,
          seasonLatestVisitAt: sameReachedAt.toISOString(),
        },
        {
          userIdx: extraUser.idx,
          seasonRank: 3,
          seasonLatestVisitAt: sameReachedAt.toISOString(),
        },
      ]);
    });

    it('200 - multiple same-score groups are ranked independently', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;
      const [
        highScoreFirstUser,
        highScoreLastUser,
        middleScoreLastUser,
        lowScoreUser,
      ] = await userSeedHelper.seedAll([
        { nickname: 'season-high-score-first-user' },
        { nickname: 'season-high-score-last-user' },
        { nickname: 'season-middle-score-last-user' },
        { nickname: 'season-low-score-user' },
      ]);
      const activatedAt = new Date('2026-05-15T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [highScoreNfc, middleScoreNfc, lowScoreNfc] =
        await nfcSeedHelper.seedAll([
          { placeIdx: place.idx, score: 30, activatedAt },
          { placeIdx: place.idx, score: 20, activatedAt },
          { placeIdx: place.idx, score: 10, activatedAt },
        ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Multiple Same Score Group League',
        createdAt: new Date('2026-05-01T00:00:00.000Z'),
        startAt: new Date('2026-06-01T00:00:00.000Z'),
        endAt: new Date('2026-06-07T23:59:59.000Z'),
        activatedAt,
      });
      const highScoreFirstReachedAt = new Date('2026-06-02T09:00:00.000Z');
      const highScoreSameReachedAt = new Date('2026-06-02T10:00:00.000Z');
      const middleScoreFirstReachedAt = new Date('2026-06-03T09:00:00.000Z');
      const middleScoreLastReachedAt = new Date('2026-06-03T10:00:00.000Z');
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: highScoreFirstUser.idx,
          nfcIdx: highScoreNfc.idx,
          score: highScoreNfc.score,
          createdAt: highScoreFirstReachedAt,
        },
        {
          userIdx: loginUser1.idx,
          nfcIdx: highScoreNfc.idx,
          score: highScoreNfc.score,
          createdAt: highScoreSameReachedAt,
        },
        {
          userIdx: highScoreLastUser.idx,
          nfcIdx: highScoreNfc.idx,
          score: highScoreNfc.score,
          createdAt: highScoreSameReachedAt,
        },
        {
          userIdx: loginUser2.idx,
          nfcIdx: middleScoreNfc.idx,
          score: middleScoreNfc.score,
          createdAt: middleScoreFirstReachedAt,
        },
        {
          userIdx: middleScoreLastUser.idx,
          nfcIdx: middleScoreNfc.idx,
          score: middleScoreNfc.score,
          createdAt: middleScoreLastReachedAt,
        },
        {
          userIdx: lowScoreUser.idx,
          nfcIdx: lowScoreNfc.idx,
          score: lowScoreNfc.score,
          createdAt: new Date('2026-06-04T09:00:00.000Z'),
        },
      ]);

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/season-ranking/all`)
        .query({ page: 1 })
        .expect(200);

      const body: GetSeasonRankingAllResponseDto = response.body;

      expect(loginUser1.idx).toBeLessThan(highScoreLastUser.idx);
      expect(
        body.seasonUserRankingList.map(
          ({ userIdx, seasonRank, seasonScore }) => ({
            userIdx,
            seasonRank,
            seasonScore,
          }),
        ),
      ).toStrictEqual([
        { userIdx: highScoreFirstUser.idx, seasonRank: 1, seasonScore: 30 },
        { userIdx: loginUser1.idx, seasonRank: 2, seasonScore: 30 },
        { userIdx: highScoreLastUser.idx, seasonRank: 3, seasonScore: 30 },
        { userIdx: loginUser2.idx, seasonRank: 4, seasonScore: 20 },
        { userIdx: middleScoreLastUser.idx, seasonRank: 5, seasonScore: 20 },
        { userIdx: lowScoreUser.idx, seasonRank: 6, seasonScore: 10 },
      ]);
    });

    it('200 - pagination check', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;
      const extraUserList = await userSeedHelper.seedAll(
        Array.from({ length: 9 }, (_, index) => ({
          nickname: `season-ranking-user-${index + 1}`,
        })),
      );
      const activatedAt = new Date('2026-05-15T00:00:00.000Z');
      const startAt = new Date('2026-06-01T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt,
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Season Ranking Pagination League',
        createdAt: new Date('2026-05-01T00:00:00.000Z'),
        startAt,
        endAt: new Date('2026-06-07T23:59:59.000Z'),
        activatedAt,
      });
      const rankedUserIdxList = [
        loginUser1.idx,
        loginUser2.idx,
        ...extraUserList.map(({ idx }) => idx),
      ];
      await placeVisitSeedHelper.seedAll(
        rankedUserIdxList.map((userIdx, index) => ({
          userIdx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date(startAt.getTime() + index * 1000),
        })),
      );

      const firstPageResponse = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/season-ranking/all`)
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/season-ranking/all`)
        .query({ page: 2 })
        .expect(200);

      const firstPageBody: GetSeasonRankingAllResponseDto =
        firstPageResponse.body;
      const secondPageBody: GetSeasonRankingAllResponseDto =
        secondPageResponse.body;

      expect(firstPageBody.hasNext).toBe(true);
      expect(firstPageBody.seasonUserRankingList).toHaveLength(10);
      expect(
        firstPageBody.seasonUserRankingList.map(({ userIdx }) => userIdx),
      ).toStrictEqual(rankedUserIdxList.slice(0, 10));
      expect(secondPageBody.hasNext).toBe(false);
      expect(secondPageBody.seasonUserRankingList).toHaveLength(1);
      expect(secondPageBody.seasonUserRankingList[0].userIdx).toBe(
        rankedUserIdxList[10],
      );
    });

    it('200 - empty season ranking', async () => {
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Empty Ranking League',
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        startAt: new Date('2026-07-01T00:00:00.000Z'),
        endAt: new Date('2026-07-07T23:59:59.000Z'),
        activatedAt: new Date('2026-06-15T00:00:00.000Z'),
      });

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/season-ranking/all`)
        .query({ page: 1 })
        .expect(200);

      const body: GetSeasonRankingAllResponseDto = response.body;

      expect(body.hasNext).toBe(false);
      expect(body.seasonUserRankingList).toStrictEqual([]);
    });

    it('400 - league season idx is invalid', async () => {
      await testHelper
        .test()
        .get('/league-season/invalid-league-season-idx/season-ranking/all')
        .query({ page: 1 })
        .expect(400);
    });

    it('400 - page is missing', async () => {
      await testHelper
        .test()
        .get('/league-season/1/season-ranking/all')
        .expect(400);
    });

    it('400 - page is invalid', async () => {
      await testHelper
        .test()
        .get('/league-season/1/season-ranking/all')
        .query({ page: 0 })
        .expect(400);
    });

    it('404 - league season does not exist', async () => {
      await testHelper
        .test()
        .get('/league-season/2147483647/season-ranking/all')
        .query({ page: 1 })
        .expect(404);
    });

    it('404 - inactive league season is not exposed', async () => {
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Inactive Ranking League',
        startAt: new Date('2026-08-01T00:00:00.000Z'),
        endAt: new Date('2026-08-07T23:59:59.000Z'),
        activatedAt: null,
      });

      await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/season-ranking/all`)
        .query({ page: 1 })
        .expect(404);
    });
  });

  describe('GET /cumulative-ranking/all', () => {
    it('200 - cumulative ranking field and all visit period check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const activatedAt = new Date('2025-12-15T00:00:00.000Z');
      const startAt = new Date('2026-01-01T00:00:00.000Z');
      const endAt = new Date('2026-01-07T23:59:59.000Z');
      const deletedUser = await userSeedHelper.seed({
        nickname: 'deleted-cumulative-ranking-user',
        deletedAt: new Date('2026-02-01T00:00:00.000Z'),
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [beforeSeasonNfc, seasonNfc, afterSeasonNfc, otherUserNfc] =
        await nfcSeedHelper.seedAll([
          { placeIdx: place.idx, score: 10, activatedAt },
          { placeIdx: place.idx, score: 20, activatedAt },
          { placeIdx: place.idx, score: 30, activatedAt },
          { placeIdx: place.idx, score: 50, activatedAt },
        ]);
      await leagueSeasonSeedHelper.seed({
        name: 'Cumulative Reference League',
        createdAt: new Date('2025-12-01T00:00:00.000Z'),
        startAt,
        endAt,
        activatedAt,
      });
      const loginUserLatestVisitAt = new Date('2026-01-08T00:00:00.000Z');
      const otherUserLatestVisitAt = new Date('2026-01-04T12:00:00.000Z');
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: beforeSeasonNfc.idx,
          score: beforeSeasonNfc.score,
          createdAt: new Date(startAt.getTime() - 1),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: seasonNfc.idx,
          score: seasonNfc.score,
          createdAt: startAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: seasonNfc.idx,
          score: seasonNfc.score,
          createdAt: endAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: afterSeasonNfc.idx,
          score: afterSeasonNfc.score,
          createdAt: loginUserLatestVisitAt,
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: otherUserNfc.idx,
          score: otherUserNfc.score,
          createdAt: otherUserLatestVisitAt,
        },
        {
          userIdx: deletedUser.idx,
          nfcIdx: otherUserNfc.idx,
          score: otherUserNfc.score,
          createdAt: new Date('2026-01-03T12:00:00.000Z'),
        },
      ]);
      const [loginUserData, otherUserData] = await Promise.all([
        testHelper.getPrisma().user.findUniqueOrThrow({
          where: { idx: loginUser.idx },
        }),
        testHelper.getPrisma().user.findUniqueOrThrow({
          where: { idx: otherUser.idx },
        }),
      ]);

      const response = await testHelper
        .test()
        .get('/cumulative-ranking/all')
        .query({ page: 1 })
        .expect(200);

      const body: GetCumulativeRankingAllResponseDto = response.body;

      expect(body.hasNext).toBe(false);
      expect(body.cumulativeUserRankingList).toHaveLength(2);
      expect(body.cumulativeUserRankingList[0]).toStrictEqual({
        userIdx: loginUser.idx,
        nickname: loginUserData.nickname,
        cumulativeRank: 1,
        cumulativeScore: 80,
        cumulativeLatestVisitAt: loginUserLatestVisitAt.toISOString(),
      });
      expect(body.cumulativeUserRankingList[1]).toStrictEqual({
        userIdx: otherUser.idx,
        nickname: otherUserData.nickname,
        cumulativeRank: 2,
        cumulativeScore: 50,
        cumulativeLatestVisitAt: otherUserLatestVisitAt.toISOString(),
      });
      expect(
        body.cumulativeUserRankingList.some(
          ({ userIdx }) => userIdx === deletedUser.idx,
        ),
      ).toBe(false);
    });

    it('200 - same cumulative score is ranked by who reached it first', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const activatedAt = new Date('2026-01-15T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [tenScoreNfc, twentyScoreNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, score: 10, activatedAt },
        { placeIdx: place.idx, score: 20, activatedAt },
      ]);
      const loginUserReachedAt = new Date('2026-02-02T10:00:00.000Z');
      const otherUserReachedAt = new Date('2026-02-03T10:00:00.000Z');
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: twentyScoreNfc.idx,
          score: twentyScoreNfc.score,
          createdAt: loginUserReachedAt,
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: tenScoreNfc.idx,
          score: tenScoreNfc.score,
          createdAt: new Date('2026-02-02T09:00:00.000Z'),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: tenScoreNfc.idx,
          score: tenScoreNfc.score,
          createdAt: otherUserReachedAt,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/cumulative-ranking/all')
        .query({ page: 1 })
        .expect(200);

      const body: GetCumulativeRankingAllResponseDto = response.body;

      expect(
        body.cumulativeUserRankingList.map(
          ({ userIdx, cumulativeRank, cumulativeLatestVisitAt }) => ({
            userIdx,
            cumulativeRank,
            cumulativeLatestVisitAt,
          }),
        ),
      ).toStrictEqual([
        {
          userIdx: loginUser.idx,
          cumulativeRank: 1,
          cumulativeLatestVisitAt: loginUserReachedAt.toISOString(),
        },
        {
          userIdx: otherUser.idx,
          cumulativeRank: 2,
          cumulativeLatestVisitAt: otherUserReachedAt.toISOString(),
        },
      ]);
    });

    it('200 - multiple cumulative same-score groups are ranked independently', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;
      const [
        highScoreFirstUser,
        highScoreLastUser,
        middleScoreLastUser,
        lowScoreUser,
      ] = await userSeedHelper.seedAll([
        { nickname: 'cumulative-high-score-first-user' },
        { nickname: 'cumulative-high-score-last-user' },
        { nickname: 'cumulative-middle-score-last-user' },
        { nickname: 'cumulative-low-score-user' },
      ]);
      const activatedAt = new Date('2026-02-15T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [highScoreNfc, middleScoreNfc, lowScoreNfc] =
        await nfcSeedHelper.seedAll([
          { placeIdx: place.idx, score: 30, activatedAt },
          { placeIdx: place.idx, score: 20, activatedAt },
          { placeIdx: place.idx, score: 10, activatedAt },
        ]);
      const highScoreFirstReachedAt = new Date('2026-03-02T09:00:00.000Z');
      const highScoreSameReachedAt = new Date('2026-03-02T10:00:00.000Z');
      const middleScoreFirstReachedAt = new Date('2026-03-03T09:00:00.000Z');
      const middleScoreLastReachedAt = new Date('2026-03-03T10:00:00.000Z');
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: highScoreFirstUser.idx,
          nfcIdx: highScoreNfc.idx,
          score: highScoreNfc.score,
          createdAt: highScoreFirstReachedAt,
        },
        {
          userIdx: loginUser1.idx,
          nfcIdx: highScoreNfc.idx,
          score: highScoreNfc.score,
          createdAt: highScoreSameReachedAt,
        },
        {
          userIdx: highScoreLastUser.idx,
          nfcIdx: highScoreNfc.idx,
          score: highScoreNfc.score,
          createdAt: highScoreSameReachedAt,
        },
        {
          userIdx: loginUser2.idx,
          nfcIdx: middleScoreNfc.idx,
          score: middleScoreNfc.score,
          createdAt: middleScoreFirstReachedAt,
        },
        {
          userIdx: middleScoreLastUser.idx,
          nfcIdx: middleScoreNfc.idx,
          score: middleScoreNfc.score,
          createdAt: middleScoreLastReachedAt,
        },
        {
          userIdx: lowScoreUser.idx,
          nfcIdx: lowScoreNfc.idx,
          score: lowScoreNfc.score,
          createdAt: new Date('2026-03-04T09:00:00.000Z'),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/cumulative-ranking/all')
        .query({ page: 1 })
        .expect(200);

      const body: GetCumulativeRankingAllResponseDto = response.body;

      expect(loginUser1.idx).toBeLessThan(highScoreLastUser.idx);
      expect(
        body.cumulativeUserRankingList.map(
          ({ userIdx, cumulativeRank, cumulativeScore }) => ({
            userIdx,
            cumulativeRank,
            cumulativeScore,
          }),
        ),
      ).toStrictEqual([
        {
          userIdx: highScoreFirstUser.idx,
          cumulativeRank: 1,
          cumulativeScore: 30,
        },
        {
          userIdx: loginUser1.idx,
          cumulativeRank: 2,
          cumulativeScore: 30,
        },
        {
          userIdx: highScoreLastUser.idx,
          cumulativeRank: 3,
          cumulativeScore: 30,
        },
        {
          userIdx: loginUser2.idx,
          cumulativeRank: 4,
          cumulativeScore: 20,
        },
        {
          userIdx: middleScoreLastUser.idx,
          cumulativeRank: 5,
          cumulativeScore: 20,
        },
        {
          userIdx: lowScoreUser.idx,
          cumulativeRank: 6,
          cumulativeScore: 10,
        },
      ]);
    });

    it('200 - pagination check', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;
      const extraUserList = await userSeedHelper.seedAll(
        Array.from({ length: 9 }, (_, index) => ({
          nickname: `cumulative-ranking-user-${index + 1}`,
        })),
      );
      const activatedAt = new Date('2026-02-15T00:00:00.000Z');
      const firstVisitAt = new Date('2026-03-01T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt,
      });
      const rankedUserIdxList = [
        loginUser1.idx,
        loginUser2.idx,
        ...extraUserList.map(({ idx }) => idx),
      ];
      await placeVisitSeedHelper.seedAll(
        rankedUserIdxList.map((userIdx, index) => ({
          userIdx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date(firstVisitAt.getTime() + index * 1000),
        })),
      );

      const firstPageResponse = await testHelper
        .test()
        .get('/cumulative-ranking/all')
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/cumulative-ranking/all')
        .query({ page: 2 })
        .expect(200);

      const firstPageBody: GetCumulativeRankingAllResponseDto =
        firstPageResponse.body;
      const secondPageBody: GetCumulativeRankingAllResponseDto =
        secondPageResponse.body;

      expect(firstPageBody.hasNext).toBe(true);
      expect(firstPageBody.cumulativeUserRankingList).toHaveLength(10);
      expect(
        firstPageBody.cumulativeUserRankingList.map(({ userIdx }) => userIdx),
      ).toStrictEqual(rankedUserIdxList.slice(0, 10));
      expect(secondPageBody.hasNext).toBe(false);
      expect(secondPageBody.cumulativeUserRankingList).toHaveLength(1);
      expect(secondPageBody.cumulativeUserRankingList[0].userIdx).toBe(
        rankedUserIdxList[10],
      );
    });

    it('200 - empty cumulative ranking', async () => {
      const response = await testHelper
        .test()
        .get('/cumulative-ranking/all')
        .query({ page: 1 })
        .expect(200);

      const body: GetCumulativeRankingAllResponseDto = response.body;

      expect(body.hasNext).toBe(false);
      expect(body.cumulativeUserRankingList).toStrictEqual([]);
    });

    it('400 - page is missing', async () => {
      await testHelper.test().get('/cumulative-ranking/all').expect(400);
    });

    it('400 - page is invalid', async () => {
      await testHelper
        .test()
        .get('/cumulative-ranking/all')
        .query({ page: 0 })
        .expect(400);
    });
  });

  describe('GET /user-ranking', () => {
    it('200 - latest active started league season and period check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const now = new Date();
      const day = 24 * 60 * 60 * 1000;
      const activatedAt = new Date(now.getTime() - 40 * day);
      const targetStartAt = new Date(now.getTime() - 10 * day);
      const targetEndAt = new Date(now.getTime() - 5 * day);
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [
        beforeSeasonNfc,
        startBoundaryNfc,
        endBoundaryNfc,
        afterSeasonNfc,
        otherUserNfc,
      ] = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, score: 5, activatedAt },
        { placeIdx: place.idx, score: 10, activatedAt },
        { placeIdx: place.idx, score: 20, activatedAt },
        { placeIdx: place.idx, score: 30, activatedAt },
        { placeIdx: place.idx, score: 40, activatedAt },
      ]);
      await leagueSeasonSeedHelper.seedAll([
        {
          name: 'Older Active League',
          createdAt: new Date(now.getTime() - 40 * day),
          startAt: new Date(now.getTime() - 30 * day),
          endAt: new Date(now.getTime() - 20 * day),
          activatedAt,
        },
        {
          name: 'Target Latest Active League',
          createdAt: new Date(now.getTime() - 20 * day),
          startAt: targetStartAt,
          endAt: targetEndAt,
          activatedAt,
        },
        {
          name: 'More Recent Inactive League',
          createdAt: new Date(now.getTime() - 4 * day),
          startAt: new Date(now.getTime() - 3 * day),
          endAt: new Date(now.getTime() - 2 * day),
          activatedAt: null,
        },
        {
          name: 'Future Active League',
          createdAt: now,
          startAt: new Date(now.getTime() + day),
          endAt: new Date(now.getTime() + 2 * day),
          activatedAt: now,
        },
      ]);
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: beforeSeasonNfc.idx,
          score: beforeSeasonNfc.score,
          createdAt: new Date(targetStartAt.getTime() - 1),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: startBoundaryNfc.idx,
          score: startBoundaryNfc.score,
          createdAt: targetStartAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: endBoundaryNfc.idx,
          score: endBoundaryNfc.score,
          createdAt: targetEndAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: afterSeasonNfc.idx,
          score: afterSeasonNfc.score,
          createdAt: new Date(targetEndAt.getTime() + 1),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: otherUserNfc.idx,
          score: otherUserNfc.score,
          createdAt: new Date(targetStartAt.getTime() + day),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/user-ranking')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const body: UserRankingOverviewEntity = response.body;

      expect(body).toStrictEqual({
        seasonRank: 2,
        cumulativeRank: 1,
        cumulativeScore: 65,
        seasonRankingParticipantCount: 2,
        cumulativeRankingParticipantCount: 2,
      });
    });

    it('200 - latest inactive league falls back to previous active league', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const now = new Date();
      const day = 24 * 60 * 60 * 1000;
      const activatedAt = new Date(now.getTime() - 30 * day);
      const activeLeagueStartAt = new Date(now.getTime() - 20 * day);
      const activeLeagueEndAt = new Date(now.getTime() - 15 * day);
      const inactiveLeagueStartAt = new Date(now.getTime() - 10 * day);
      const inactiveLeagueEndAt = new Date(now.getTime() - 5 * day);
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [
        loginUserActiveLeagueNfc,
        otherUserActiveLeagueNfc,
        inactiveLeagueNfc,
      ] = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, score: 10, activatedAt },
        { placeIdx: place.idx, score: 20, activatedAt },
        { placeIdx: place.idx, score: 100, activatedAt },
      ]);
      await leagueSeasonSeedHelper.seedAll([
        {
          name: 'Previous Active League',
          createdAt: new Date(now.getTime() - 25 * day),
          startAt: activeLeagueStartAt,
          endAt: activeLeagueEndAt,
          activatedAt,
        },
        {
          name: 'Latest Inactive League',
          createdAt: new Date(now.getTime() - 12 * day),
          startAt: inactiveLeagueStartAt,
          endAt: inactiveLeagueEndAt,
          activatedAt: null,
        },
      ]);
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: loginUserActiveLeagueNfc.idx,
          score: loginUserActiveLeagueNfc.score,
          createdAt: new Date(activeLeagueStartAt.getTime() + day),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: otherUserActiveLeagueNfc.idx,
          score: otherUserActiveLeagueNfc.score,
          createdAt: new Date(activeLeagueStartAt.getTime() + 2 * day),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: inactiveLeagueNfc.idx,
          score: inactiveLeagueNfc.score,
          createdAt: new Date(inactiveLeagueStartAt.getTime() + day),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/user-ranking')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const body: UserRankingOverviewEntity = response.body;

      expect(body).toStrictEqual({
        seasonRank: 2,
        cumulativeRank: 1,
        cumulativeScore: 110,
        seasonRankingParticipantCount: 2,
        cumulativeRankingParticipantCount: 2,
      });
    });

    it('200 - user without place visit has no ranking', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const now = new Date();
      const day = 24 * 60 * 60 * 1000;
      await leagueSeasonSeedHelper.seed({
        name: 'Active League Without Visit',
        createdAt: new Date(now.getTime() - 10 * day),
        startAt: new Date(now.getTime() - 5 * day),
        endAt: new Date(now.getTime() + 5 * day),
        activatedAt: new Date(now.getTime() - 6 * day),
      });

      const response = await testHelper
        .test()
        .get('/user-ranking')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const body: UserRankingOverviewEntity = response.body;

      expect(body).toStrictEqual({
        seasonRank: null,
        cumulativeRank: null,
        cumulativeScore: 0,
        seasonRankingParticipantCount: 0,
        cumulativeRankingParticipantCount: 0,
      });
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().get('/user-ranking').expect(401);
    });

    it('404 - active started league season does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const now = new Date();
      const day = 24 * 60 * 60 * 1000;
      await leagueSeasonSeedHelper.seedAll([
        {
          name: 'Inactive Started League',
          startAt: new Date(now.getTime() - 5 * day),
          endAt: new Date(now.getTime() + 5 * day),
          activatedAt: null,
        },
        {
          name: 'Active Future League',
          startAt: new Date(now.getTime() + day),
          endAt: new Date(now.getTime() + 5 * day),
          activatedAt: now,
        },
      ]);

      await testHelper
        .test()
        .get('/user-ranking')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });
  });
});
