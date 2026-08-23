import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { LeagueSeasonResultSeedHelper } from '@libs/testing/seed/league-season/league-season-result.seed';
import { LeagueSeasonSeedHelper } from '@libs/testing/seed/league-season/league-season.seed';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceVisitSeedHelper } from '@libs/testing/seed/place-visit/place-visit.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { RewardSeedHelper } from '@libs/testing/seed/reward/reward.seed';
import { UserRewardSeedHelper } from '@libs/testing/seed/user-reward/user-reward.seed';
import { GetLeagueSeasonAllResponseDto } from '@user/api/league-season/dto/response/get-league-season-all.response.dto';
import { LeagueSeasonResultOverviewEntity } from '@user/api/league-season/entity/league-season-result-overview.entity';
import { LeagueSeasonResultEntity } from '@user/api/league-season/entity/league-season-result.entity';
import { LeagueSeasonEntity } from '@user/api/league-season/entity/league-season.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from '../../setup/test.helper';

describe('League Season E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
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

  describe('GET /league-season', () => {
    it('200 - league season field check', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;
      const now = new Date();
      const date = now.toISOString().slice(0, 10);
      const [firstReward, secondReward, deletedOptionReward] =
        await rewardSeedHelper.seedAll([
          {
            name: 'First place reward',
            imagePath: '/reward/first-place.png',
            activatedAt: now,
          },
          {
            name: 'Second place reward',
            imagePath: '/reward/second-place.png',
            activatedAt: now,
          },
          {
            name: 'Deleted option reward',
            imagePath: '/reward/deleted-option.png',
            activatedAt: now,
          },
        ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Current League',
        createdAt: now,
        startAt: new Date(`${date}T00:00:00.000Z`),
        endAt: new Date(`${date}T23:59:59.000Z`),
        activatedAt: now,
        finalizedAt: null,
        rewardOptionList: [
          {
            rewardIdx: firstReward.idx,
            targetRank: 1,
          },
          {
            rewardIdx: secondReward.idx,
            targetRank: 2,
          },
          {
            rewardIdx: deletedOptionReward.idx,
            targetRank: 3,
            deletedAt: now,
          },
        ],
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: now,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt: now,
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser1.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
        },
        {
          userIdx: loginUser2.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: date, endAt: date })
        .expect(200);

      const body: LeagueSeasonEntity = response.body;

      expect(body.idx).toBe(leagueSeason.idx);
      expect(body.name).toBe(leagueSeason.name);
      expect(body.startAt).toBe(leagueSeason.startAt.toISOString());
      expect(body.endAt).toBe(leagueSeason.endAt.toISOString());
      expect(body.activatedAt).toBe(leagueSeason.activatedAt?.toISOString());
      expect(body.createdAt).toBe(leagueSeason.createdAt.toISOString());
      expect(body.participantCount).toBe(2);
      expect(body.rewardOptionList).toHaveLength(2);
      expect(body.rewardOptionList[0].targetRank).toBe(1);
      expect(body.rewardOptionList[0].reward.idx).toBe(firstReward.idx);
      expect(body.rewardOptionList[0].reward.name).toBe(firstReward.name);
      expect(body.rewardOptionList[0].reward.imagePath).toBe(
        firstReward.imagePath,
      );
      expect(body.rewardOptionList[1].targetRank).toBe(2);
      expect(body.rewardOptionList[1].reward.idx).toBe(secondReward.idx);
      expect(body.rewardOptionList[1].reward.name).toBe(secondReward.name);
      expect(body.rewardOptionList[1].reward.imagePath).toBe(
        secondReward.imagePath,
      );
      expect(
        body.rewardOptionList.some(
          ({ reward }) => reward.idx === deletedOptionReward.idx,
        ),
      ).toBe(false);
    });

    it('200 - get latest activated league season when period is not provided', async () => {
      const now = Date.now();
      const activatedAt = new Date(now - 40 * 24 * 60 * 60 * 1000);
      const [, latestActivatedLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            name: 'Previous Activated League',
            startAt: new Date(now - 30 * 24 * 60 * 60 * 1000),
            endAt: new Date(now - 20 * 24 * 60 * 60 * 1000),
            activatedAt,
          },
          {
            name: 'Latest Activated League',
            startAt: new Date(now - 10 * 24 * 60 * 60 * 1000),
            endAt: new Date(now),
            activatedAt,
          },
          {
            name: 'Newer Inactive League',
            startAt: new Date(now + 10 * 24 * 60 * 60 * 1000),
            endAt: new Date(now + 20 * 24 * 60 * 60 * 1000),
            activatedAt: null,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/league-season')
        .expect(200);

      const body: LeagueSeasonEntity = response.body;

      expect(body.idx).toBe(latestActivatedLeagueSeason.idx);
      expect(body.name).toBe(latestActivatedLeagueSeason.name);
      expect(body.participantCount).toBe(0);
    });

    it('200 - no reward option and no place visit', async () => {
      const now = new Date();
      const date = now.toISOString().slice(0, 10);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'League without reward and visit',
        createdAt: now,
        startAt: new Date(`${date}T00:00:00.000Z`),
        endAt: new Date(`${date}T23:59:59.000Z`),
        activatedAt: now,
        finalizedAt: null,
        rewardOptionList: null,
      });

      const response = await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: date, endAt: date })
        .expect(200);

      const body: LeagueSeasonEntity = response.body;

      expect(body.idx).toBe(leagueSeason.idx);
      expect(body.participantCount).toBe(0);
      expect(body.rewardOptionList).toStrictEqual([]);
    });

    it('200 - get only league season matching exact period', async () => {
      const targetStartAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      targetStartAt.setUTCHours(0, 0, 0, 0);
      const targetEndAt = new Date(targetStartAt);
      targetEndAt.setUTCHours(23, 59, 59, 0);
      const otherStartAt = new Date(
        targetStartAt.getTime() + 24 * 60 * 60 * 1000,
      );
      const otherEndAt = new Date(targetEndAt.getTime() + 24 * 60 * 60 * 1000);
      const [targetLeagueSeason] = await leagueSeasonSeedHelper.seedAll([
        {
          name: 'Target League',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          startAt: targetStartAt,
          endAt: targetEndAt,
          activatedAt: new Date('2026-01-02T00:00:00.000Z'),
          finalizedAt: null,
        },
        {
          name: 'Other League',
          createdAt: new Date('2026-01-03T00:00:00.000Z'),
          startAt: otherStartAt,
          endAt: otherEndAt,
          activatedAt: new Date('2026-01-04T00:00:00.000Z'),
          finalizedAt: null,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/league-season')
        .query({
          startAt: targetStartAt.toISOString().slice(0, 10),
          endAt: targetEndAt.toISOString().slice(0, 10),
        })
        .expect(200);

      const body: LeagueSeasonEntity = response.body;

      expect(body.idx).toBe(targetLeagueSeason.idx);
      expect(body.name).toBe(targetLeagueSeason.name);
    });

    it('200 - count only place visits within target league season period', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;
      const createdAt = new Date('2026-06-01T00:00:00.000Z');
      const [previousLeagueSeason, targetLeagueSeason, nextLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            name: 'Previous League',
            createdAt,
            startAt: new Date('2026-07-01T00:00:00.000Z'),
            endAt: new Date('2026-07-07T23:59:59.000Z'),
            activatedAt: createdAt,
            finalizedAt: new Date('2026-07-08T00:00:00.000Z'),
          },
          {
            name: 'Target League',
            createdAt,
            startAt: new Date('2026-08-01T00:00:00.000Z'),
            endAt: new Date('2026-08-07T23:59:59.000Z'),
            activatedAt: createdAt,
            finalizedAt: new Date('2026-08-08T00:00:00.000Z'),
          },
          {
            name: 'Next League',
            createdAt,
            startAt: new Date('2026-08-09T00:00:00.000Z'),
            endAt: new Date('2026-08-13T23:59:59.000Z'),
            activatedAt: createdAt,
            finalizedAt: new Date('2026-08-14T00:00:00.000Z'),
          },
        ]);
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: createdAt,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt: createdAt,
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser1.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date('2026-07-03T10:00:00.000Z'),
        },
        {
          userIdx: loginUser1.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date('2026-08-03T10:00:00.000Z'),
        },
        {
          userIdx: loginUser2.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date('2026-08-05T10:00:00.000Z'),
        },
        {
          userIdx: loginUser2.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date('2026-08-10T10:00:00.000Z'),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: '2026-08-01', endAt: '2026-08-07' })
        .expect(200);

      const body: LeagueSeasonEntity = response.body;

      expect(previousLeagueSeason.endAt.getTime()).toBeLessThan(
        targetLeagueSeason.startAt.getTime(),
      );
      expect(targetLeagueSeason.endAt.getTime()).toBeLessThan(
        nextLeagueSeason.startAt.getTime(),
      );
      expect(body.idx).toBe(targetLeagueSeason.idx);
      expect(body.participantCount).toBe(2);
    });

    it('200 - include place visits at league season period boundaries', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const createdAt = new Date('2026-06-01T00:00:00.000Z');
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Boundary League',
        createdAt,
        startAt: new Date('2026-08-01T00:00:00.000Z'),
        endAt: new Date('2026-08-07T23:59:59.000Z'),
        activatedAt: createdAt,
        finalizedAt: new Date('2026-08-08T00:00:00.000Z'),
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: createdAt,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt: createdAt,
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date('2026-07-31T23:59:59.999Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: leagueSeason.startAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: leagueSeason.endAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date('2026-08-07T23:59:59.001Z'),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: '2026-08-01', endAt: '2026-08-07' })
        .expect(200);

      const body: LeagueSeasonEntity = response.body;

      expect(body.idx).toBe(leagueSeason.idx);
      expect(body.participantCount).toBe(1);
    });

    it('200 - multiple reward options for same target rank', async () => {
      const activatedAt = new Date();
      const [firstReward, secondReward, otherLeagueReward] =
        await rewardSeedHelper.seedAll([
          {
            name: 'First selectable reward',
            activatedAt,
          },
          {
            name: 'Second selectable reward',
            activatedAt,
          },
          {
            name: 'Other league reward',
            activatedAt,
          },
        ]);
      const targetStartAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      targetStartAt.setUTCHours(0, 0, 0, 0);
      const targetEndAt = new Date(targetStartAt);
      targetEndAt.setUTCHours(23, 59, 59, 0);
      const otherStartAt = new Date(
        targetStartAt.getTime() + 24 * 60 * 60 * 1000,
      );
      const otherEndAt = new Date(targetEndAt.getTime() + 24 * 60 * 60 * 1000);
      const [targetLeagueSeason] = await leagueSeasonSeedHelper.seedAll([
        {
          name: 'Selectable Reward League',
          startAt: targetStartAt,
          endAt: targetEndAt,
          activatedAt,
          finalizedAt: null,
          rewardOptionList: [
            { rewardIdx: firstReward.idx, targetRank: 1 },
            { rewardIdx: secondReward.idx, targetRank: 1 },
          ],
        },
        {
          name: 'Other Reward League',
          startAt: otherStartAt,
          endAt: otherEndAt,
          activatedAt,
          finalizedAt: null,
          rewardOptionList: [
            { rewardIdx: otherLeagueReward.idx, targetRank: 1 },
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/league-season')
        .query({
          startAt: targetLeagueSeason.startAt.toISOString().slice(0, 10),
          endAt: targetLeagueSeason.endAt.toISOString().slice(0, 10),
        })
        .expect(200);

      const body: LeagueSeasonEntity = response.body;

      expect(body.rewardOptionList).toHaveLength(2);
      expect(
        body.rewardOptionList.map(({ targetRank }) => targetRank),
      ).toStrictEqual([1, 1]);
      expect(
        body.rewardOptionList.map(({ reward }) => reward.idx).sort(),
      ).toStrictEqual([firstReward.idx, secondReward.idx].sort());
      expect(
        body.rewardOptionList.some(
          ({ reward }) => reward.idx === otherLeagueReward.idx,
        ),
      ).toBe(false);
    });

    it('400 - start date is missing', async () => {
      await testHelper
        .test()
        .get('/league-season')
        .query({ endAt: '2026-08-31' })
        .expect(400);
    });

    it('400 - end date is missing', async () => {
      await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: '2026-08-01' })
        .expect(400);
    });

    it('400 - start date format is invalid', async () => {
      await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: '2026-08-32', endAt: '2026-08-31' })
        .expect(400);
    });

    it('400 - end date format is invalid', async () => {
      await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: '2026-08-01', endAt: 'invalid-date' })
        .expect(400);
    });

    it('404 - league season does not exist', async () => {
      await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: '2025-01-01', endAt: '2025-01-31' })
        .expect(404);
    });

    it('404 - activated league season does not exist when period is not provided', async () => {
      await leagueSeasonSeedHelper.seed({
        name: 'Inactive League',
        startAt: new Date(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        activatedAt: null,
      });

      await testHelper.test().get('/league-season').expect(404);
    });

    it('404 - inactive league season is not exposed', async () => {
      await leagueSeasonSeedHelper.seed({
        name: 'Inactive League',
        createdAt: new Date('2026-07-01T00:00:00.000Z'),
        startAt: new Date('2026-10-01T00:00:00.000Z'),
        endAt: new Date('2026-10-07T23:59:59.000Z'),
        activatedAt: null,
        finalizedAt: null,
      });

      await testHelper
        .test()
        .get('/league-season')
        .query({ startAt: '2026-10-01', endAt: '2026-10-07' })
        .expect(404);
    });
  });

  describe('GET /league-season/all', () => {
    it('200 - league season overview field and default order check', async () => {
      const now = Date.now();
      const activatedAt = new Date(now - 24 * 60 * 60 * 1000);
      const [
        oldestLeagueSeason,
        middleLeagueSeason,
        latestLeagueSeason,
        inactiveLeagueSeason,
      ] = await leagueSeasonSeedHelper.seedAll([
        {
          name: 'Oldest League',
          createdAt: new Date(now + 3000),
          startAt: new Date(now + 24 * 60 * 60 * 1000),
          endAt: new Date(now + 31 * 24 * 60 * 60 * 1000),
          activatedAt,
          finalizedAt: null,
        },
        {
          name: 'Middle League',
          createdAt: new Date(now + 2000),
          startAt: new Date(now + 32 * 24 * 60 * 60 * 1000),
          endAt: new Date(now + 39 * 24 * 60 * 60 * 1000),
          activatedAt,
          finalizedAt: null,
        },
        {
          name: 'Latest League',
          createdAt: new Date(now + 1000),
          startAt: new Date(now + 40 * 24 * 60 * 60 * 1000),
          endAt: new Date(now + 47 * 24 * 60 * 60 * 1000),
          activatedAt,
          finalizedAt: null,
        },
        {
          name: 'Inactive Latest League',
          createdAt: new Date(now + 4000),
          startAt: new Date(now + 48 * 24 * 60 * 60 * 1000),
          endAt: new Date(now + 55 * 24 * 60 * 60 * 1000),
          activatedAt: null,
          finalizedAt: null,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/league-season/all')
        .query({ page: 1 })
        .expect(200);

      const body: GetLeagueSeasonAllResponseDto = response.body;

      expect(body.hasNext).toBe(false);
      expect(body.leagueSeasonOverviewList).toHaveLength(3);
      expect(body.leagueSeasonOverviewList.map(({ idx }) => idx)).toStrictEqual(
        [
          latestLeagueSeason.idx,
          middleLeagueSeason.idx,
          oldestLeagueSeason.idx,
        ],
      );
      expect(body.leagueSeasonOverviewList[0].name).toBe(
        latestLeagueSeason.name,
      );
      expect(body.leagueSeasonOverviewList[0].startAt).toBe(
        latestLeagueSeason.startAt.toISOString(),
      );
      expect(body.leagueSeasonOverviewList[0].endAt).toBe(
        latestLeagueSeason.endAt.toISOString(),
      );
      expect(body.leagueSeasonOverviewList[0].activatedAt).toBe(
        latestLeagueSeason.activatedAt?.toISOString(),
      );
      expect(body.leagueSeasonOverviewList[0].createdAt).toBe(
        latestLeagueSeason.createdAt.toISOString(),
      );
      expect(
        body.leagueSeasonOverviewList.some(
          ({ idx }) => idx === inactiveLeagueSeason.idx,
        ),
      ).toBe(false);
    });

    it('200 - ascending order check', async () => {
      const now = Date.now();
      const activatedAt = new Date(now);
      const [oldestLeagueSeason, latestLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            startAt: new Date(now + 24 * 60 * 60 * 1000),
            endAt: new Date(now + 31 * 24 * 60 * 60 * 1000),
            activatedAt,
            finalizedAt: null,
          },
          {
            startAt: new Date(now + 32 * 24 * 60 * 60 * 1000),
            endAt: new Date(now + 39 * 24 * 60 * 60 * 1000),
            activatedAt,
            finalizedAt: null,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/league-season/all')
        .query({ page: 1, order: 'asc' })
        .expect(200);

      const body: GetLeagueSeasonAllResponseDto = response.body;

      expect(body.leagueSeasonOverviewList.map(({ idx }) => idx)).toStrictEqual(
        [oldestLeagueSeason.idx, latestLeagueSeason.idx],
      );
    });

    it('200 - pagination check', async () => {
      const now = Date.now();
      const activatedAt = new Date(now);
      const leagueSeasonList = await leagueSeasonSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => {
          const startAt = new Date(
            now + (1 + index * 10) * 24 * 60 * 60 * 1000,
          );
          const endAt = new Date(startAt.getTime() + 6 * 24 * 60 * 60 * 1000);

          return {
            name: `League ${index + 1}`,
            startAt,
            endAt,
            activatedAt,
            finalizedAt: null,
          };
        }),
      );
      const inactiveLeagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Inactive League Outside Pagination',
        startAt: new Date(now + 200 * 24 * 60 * 60 * 1000),
        endAt: new Date(now + 207 * 24 * 60 * 60 * 1000),
        activatedAt: null,
        finalizedAt: null,
      });

      const firstPageResponse = await testHelper
        .test()
        .get('/league-season/all')
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/league-season/all')
        .query({ page: 2 })
        .expect(200);

      const firstPageBody: GetLeagueSeasonAllResponseDto =
        firstPageResponse.body;
      const secondPageBody: GetLeagueSeasonAllResponseDto =
        secondPageResponse.body;

      expect(firstPageBody.hasNext).toBe(true);
      expect(firstPageBody.leagueSeasonOverviewList).toHaveLength(10);
      expect(firstPageBody.leagueSeasonOverviewList[0].idx).toBe(
        leagueSeasonList[10].idx,
      );
      expect(secondPageBody.hasNext).toBe(false);
      expect(secondPageBody.leagueSeasonOverviewList).toHaveLength(1);
      expect(secondPageBody.leagueSeasonOverviewList[0].idx).toBe(
        leagueSeasonList[0].idx,
      );
      expect(
        [
          ...firstPageBody.leagueSeasonOverviewList,
          ...secondPageBody.leagueSeasonOverviewList,
        ].some(({ idx }) => idx === inactiveLeagueSeason.idx),
      ).toBe(false);
    });

    it('200 - empty league season list', async () => {
      await leagueSeasonSeedHelper.seed({
        activatedAt: null,
      });

      const response = await testHelper
        .test()
        .get('/league-season/all')
        .query({ page: 1 })
        .expect(200);

      const body: GetLeagueSeasonAllResponseDto = response.body;

      expect(body.hasNext).toBe(false);
      expect(body.leagueSeasonOverviewList).toStrictEqual([]);
    });

    it('400 - page is missing', async () => {
      await testHelper.test().get('/league-season/all').expect(400);
    });

    it('400 - page is invalid', async () => {
      await testHelper
        .test()
        .get('/league-season/all')
        .query({ page: 0 })
        .expect(400);
    });

    it('400 - order is invalid', async () => {
      await testHelper
        .test()
        .get('/league-season/all')
        .query({ page: 1, order: 'latest' })
        .expect(400);
    });
  });

  describe('GET /league-season/:leagueSeasonIdx/result', () => {
    it('200 - league season result field check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const createdAt = new Date('2026-05-01T00:00:00.000Z');
      const activatedAt = new Date('2026-05-15T00:00:00.000Z');
      const startAt = new Date('2026-06-01T00:00:00.000Z');
      const endAt = new Date('2026-06-07T23:59:59.000Z');
      const finalizedAt = new Date('2026-06-08T00:00:00.000Z');
      const [firstReward, secondReward, deletedOptionReward] =
        await rewardSeedHelper.seedAll([
          {
            name: 'First place reward',
            imagePath: '/reward/first-place.png',
            activatedAt,
          },
          {
            name: 'Second place reward',
            imagePath: '/reward/second-place.png',
            activatedAt,
          },
          {
            name: 'Deleted option reward',
            imagePath: '/reward/deleted-option.png',
            activatedAt,
          },
        ]);
      const [cafe, restaurant, bar] = await placeSeedHelper.seedAll([
        { type: PlaceType.CAFE, activatedAt },
        { type: PlaceType.RESTAURANT, activatedAt },
        { type: PlaceType.BAR, activatedAt },
      ]);
      const [cafeNfc, restaurantNfc, barNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: cafe.idx, score: 10, activatedAt },
        { placeIdx: restaurant.idx, score: 20, activatedAt },
        { placeIdx: bar.idx, score: 30, activatedAt },
      ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Completed League',
        createdAt,
        startAt,
        endAt,
        activatedAt,
        finalizedAt,
        rewardOptionList: [
          { rewardIdx: firstReward.idx, targetRank: 1 },
          { rewardIdx: secondReward.idx, targetRank: 2 },
          {
            rewardIdx: deletedOptionReward.idx,
            targetRank: 3,
            deletedAt: finalizedAt,
          },
        ],
      });

      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: cafeNfc.idx,
          score: cafeNfc.score,
          createdAt: new Date('2026-06-02T09:00:00.000Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: cafeNfc.idx,
          score: cafeNfc.score,
          createdAt: new Date('2026-06-03T09:00:00.000Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: restaurantNfc.idx,
          score: restaurantNfc.score,
          createdAt: new Date('2026-06-04T09:00:00.000Z'),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: barNfc.idx,
          score: barNfc.score,
          createdAt: new Date('2026-06-05T09:00:00.000Z'),
        },
      ]);
      const [leagueSeasonResult] = await leagueSeasonResultSeedHelper.seedAll([
        {
          leagueSeasonIdx: leagueSeason.idx,
          userIdx: loginUser.idx,
          finalScore: 40,
        },
        {
          leagueSeasonIdx: leagueSeason.idx,
          userIdx: otherUser.idx,
          finalScore: 30,
        },
      ]);
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });
      const persistedLeagueSeasonResult = await testHelper
        .getPrisma()
        .leagueSeasonResult.findUniqueOrThrow({
          where: { id: leagueSeasonResult.id },
        });
      const latestPlaceVisit = await testHelper
        .getPrisma()
        .placeVisit.findFirstOrThrow({
          where: { userIdx: loginUser.idx },
          orderBy: { createdAt: 'desc' },
        });

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const body: LeagueSeasonResultEntity = response.body;
      const firstRewardOption = body.leagueSeason.rewardOptionList.find(
        ({ reward }) => reward.idx === firstReward.idx,
      );
      const secondRewardOption = body.leagueSeason.rewardOptionList.find(
        ({ reward }) => reward.idx === secondReward.idx,
      );

      expect(leagueSeason.activatedAt?.getTime()).toBeGreaterThan(
        leagueSeason.createdAt.getTime(),
      );
      expect(leagueSeason.startAt.getTime()).toBeGreaterThan(
        leagueSeason.activatedAt?.getTime() ?? 0,
      );
      expect(leagueSeason.endAt.getTime()).toBeGreaterThan(
        leagueSeason.startAt.getTime(),
      );
      expect(finalizedAt.getTime()).toBeGreaterThan(
        leagueSeason.endAt.getTime(),
      );
      expect(
        persistedLeagueSeasonResult.createdAt.getTime(),
      ).toBeGreaterThanOrEqual(finalizedAt.getTime());
      expect(body.id).toBe(leagueSeasonResult.id);
      expect(body.createdAt).toBe(
        persistedLeagueSeasonResult.createdAt.toISOString(),
      );
      expect(body.leagueSeason.idx).toBe(leagueSeason.idx);
      expect(body.leagueSeason.name).toBe(leagueSeason.name);
      expect(body.leagueSeason.startAt).toBe(
        leagueSeason.startAt.toISOString(),
      );
      expect(body.leagueSeason.endAt).toBe(leagueSeason.endAt.toISOString());
      expect(body.leagueSeason.activatedAt).toBe(
        leagueSeason.activatedAt?.toISOString(),
      );
      expect(body.leagueSeason.createdAt).toBe(
        leagueSeason.createdAt.toISOString(),
      );
      expect(body.leagueSeason.rewardOptionList).toHaveLength(2);
      expect(firstRewardOption?.targetRank).toBe(1);
      expect(firstRewardOption?.reward.name).toBe(firstReward.name);
      expect(firstRewardOption?.reward.imagePath).toBe(firstReward.imagePath);
      expect(secondRewardOption?.targetRank).toBe(2);
      expect(secondRewardOption?.reward.name).toBe(secondReward.name);
      expect(secondRewardOption?.reward.imagePath).toBe(secondReward.imagePath);
      expect(
        body.leagueSeason.rewardOptionList.some(
          ({ reward }) => reward.idx === deletedOptionReward.idx,
        ),
      ).toBe(false);
      expect(body.participantCount).toBe(2);
      expect(body.userRanking.seasonRank).toBe(1);
      expect(body.userRanking.seasonScore).toBe(40);
      expect(body.userRanking.seasonLatestVisitAt).toBe(
        latestPlaceVisit.createdAt.toISOString(),
      );
      expect(body.userRanking.cumulativeRank).toBe(1);
      expect(body.userRanking.cumulativeScore).toBe(40);
      expect(body.userRanking.cumulativeLatestVisitAt).toBe(
        latestPlaceVisit.createdAt.toISOString(),
      );
      expect(body.placeVisitStatisticList).toStrictEqual([
        { placeType: PlaceType.CAFE, visitCount: 2 },
        { placeType: PlaceType.RESTAURANT, visitCount: 1 },
        { placeType: PlaceType.BAR, visitCount: 0 },
      ]);
      expect(body.userReward.id).toBe(userReward.id);
      expect(body.userReward.rewardIdx).toBeNull();
      expect(body.userReward.selectedAt).toBeNull();
      expect(body.userReward.issuedAt).toBeNull();
    });

    it('200 - same score is ranked by who reached it first', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const activatedAt = new Date('2026-06-15T00:00:00.000Z');
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
        name: 'Tie Score League',
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        startAt: new Date('2026-07-01T00:00:00.000Z'),
        endAt: new Date('2026-07-07T23:59:59.000Z'),
        activatedAt,
        finalizedAt: new Date('2026-07-08T00:00:00.000Z'),
      });

      const otherUserPlaceVisit = await placeVisitSeedHelper.seed({
        userIdx: otherUser.idx,
        nfcIdx: nfc.idx,
        score: nfc.score,
        createdAt: new Date('2026-07-03T09:00:00.000Z'),
      });
      const loginUserPlaceVisit = await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: nfc.score,
        createdAt: new Date('2026-07-03T10:00:00.000Z'),
      });
      const [loginUserLeagueSeasonResult, otherUserLeagueSeasonResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          {
            leagueSeasonIdx: leagueSeason.idx,
            userIdx: loginUser.idx,
            finalScore: 10,
          },
          {
            leagueSeasonIdx: leagueSeason.idx,
            userIdx: otherUser.idx,
            finalScore: 10,
          },
        ]);
      await userRewardSeedHelper.seedAll([
        { leagueSeasonResultId: loginUserLeagueSeasonResult.id },
        { leagueSeasonResultId: otherUserLeagueSeasonResult.id },
      ]);
      const [persistedLoginUserPlaceVisit, persistedOtherUserPlaceVisit] =
        await Promise.all([
          testHelper.getPrisma().placeVisit.findUniqueOrThrow({
            where: { id: loginUserPlaceVisit.id },
          }),
          testHelper.getPrisma().placeVisit.findUniqueOrThrow({
            where: { id: otherUserPlaceVisit.id },
          }),
        ]);

      const loginUserResponse = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);
      const otherUserResponse = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${otherUser.web.accessToken}`)
        .expect(200);

      const loginUserBody: LeagueSeasonResultEntity = loginUserResponse.body;
      const otherUserBody: LeagueSeasonResultEntity = otherUserResponse.body;

      expect(persistedLoginUserPlaceVisit.createdAt.getTime()).toBeGreaterThan(
        persistedOtherUserPlaceVisit.createdAt.getTime(),
      );
      expect(loginUserBody.userRanking.seasonScore).toBe(10);
      expect(otherUserBody.userRanking.seasonScore).toBe(10);
      expect(loginUserBody.userRanking.seasonRank).toBe(2);
      expect(otherUserBody.userRanking.seasonRank).toBe(1);
      expect(loginUserBody.userRanking.cumulativeRank).toBe(2);
      expect(otherUserBody.userRanking.cumulativeRank).toBe(1);
      expect(loginUserBody.userRanking.seasonLatestVisitAt).toBe(
        persistedLoginUserPlaceVisit.createdAt.toISOString(),
      );
      expect(otherUserBody.userRanking.seasonLatestVisitAt).toBe(
        persistedOtherUserPlaceVisit.createdAt.toISOString(),
      );
    });

    it('200 - only visits within league season period are aggregated', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const createdAt = new Date('2026-07-01T00:00:00.000Z');
      const activatedAt = new Date('2026-07-15T00:00:00.000Z');
      const startAt = new Date('2026-08-01T00:00:00.000Z');
      const endAt = new Date('2026-08-07T23:59:59.000Z');
      const [cafe, restaurant, bar] = await placeSeedHelper.seedAll([
        { type: PlaceType.CAFE, activatedAt },
        { type: PlaceType.RESTAURANT, activatedAt },
        { type: PlaceType.BAR, activatedAt },
      ]);
      const [cafeNfc, restaurantNfc, barNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: cafe.idx, score: 10, activatedAt },
        { placeIdx: restaurant.idx, score: 20, activatedAt },
        { placeIdx: bar.idx, score: 30, activatedAt },
      ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Period Boundary League',
        createdAt,
        startAt,
        endAt,
        activatedAt,
        finalizedAt: new Date('2026-08-08T00:00:00.000Z'),
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: cafeNfc.idx,
          score: cafeNfc.score,
          createdAt: new Date(startAt.getTime() - 1),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: cafeNfc.idx,
          score: cafeNfc.score,
          createdAt: startAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: restaurantNfc.idx,
          score: restaurantNfc.score,
          createdAt: new Date('2026-08-04T12:00:00.000Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: barNfc.idx,
          score: barNfc.score,
          createdAt: endAt,
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: barNfc.idx,
          score: barNfc.score,
          createdAt: new Date(endAt.getTime() + 1),
        },
      ]);
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: cafeNfc.score + restaurantNfc.score + barNfc.score,
      });
      await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      const response = await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const body: LeagueSeasonResultEntity = response.body;

      expect(body.userRanking.seasonScore).toBe(60);
      expect(body.userRanking.seasonLatestVisitAt).toBe(endAt.toISOString());
      expect(body.userRanking.cumulativeScore).toBe(60);
      expect(body.userRanking.cumulativeLatestVisitAt).toBe(
        endAt.toISOString(),
      );
      expect(body.placeVisitStatisticList).toStrictEqual([
        { placeType: PlaceType.CAFE, visitCount: 1 },
        { placeType: PlaceType.RESTAURANT, visitCount: 1 },
        { placeType: PlaceType.BAR, visitCount: 1 },
      ]);
    });

    it('200 - cumulative ranking includes only active completed leagues through target league', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const createdAt = new Date('2025-12-01T00:00:00.000Z');
      const activatedAt = new Date('2025-12-15T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const [
        inactiveLeagueNfc,
        previousLeagueLoginUserNfc,
        previousLeagueOtherUserNfc,
        targetLeagueLoginUserNfc,
        targetLeagueOtherUserNfc,
        nextLeagueNfc,
      ] = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, score: 1000, activatedAt },
        { placeIdx: place.idx, score: 20, activatedAt },
        { placeIdx: place.idx, score: 100, activatedAt },
        { placeIdx: place.idx, score: 50, activatedAt },
        { placeIdx: place.idx, score: 10, activatedAt },
        { placeIdx: place.idx, score: 200, activatedAt },
      ]);
      const [
        inactiveLeagueSeason,
        previousLeagueSeason,
        targetLeagueSeason,
        nextLeagueSeason,
      ] = await leagueSeasonSeedHelper.seedAll([
        {
          name: 'Inactive Previous League',
          createdAt,
          startAt: new Date('2026-01-01T00:00:00.000Z'),
          endAt: new Date('2026-01-07T23:59:59.000Z'),
          activatedAt: null,
          finalizedAt: new Date('2026-01-08T00:00:00.000Z'),
        },
        {
          name: 'Previous League',
          createdAt,
          startAt: new Date('2026-02-01T00:00:00.000Z'),
          endAt: new Date('2026-02-07T23:59:59.000Z'),
          activatedAt,
          finalizedAt: new Date('2026-02-08T00:00:00.000Z'),
        },
        {
          name: 'Target League',
          createdAt,
          startAt: new Date('2026-03-01T00:00:00.000Z'),
          endAt: new Date('2026-03-07T23:59:59.000Z'),
          activatedAt,
          finalizedAt: new Date('2026-03-08T00:00:00.000Z'),
        },
        {
          name: 'Next League',
          createdAt,
          startAt: new Date('2026-04-01T00:00:00.000Z'),
          endAt: new Date('2026-04-07T23:59:59.000Z'),
          activatedAt,
          finalizedAt: new Date('2026-04-08T00:00:00.000Z'),
        },
      ]);
      const targetLeagueLoginUserVisitAt = new Date('2026-03-03T12:00:00.000Z');
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: inactiveLeagueNfc.idx,
          score: inactiveLeagueNfc.score,
          createdAt: new Date('2026-01-03T12:00:00.000Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: previousLeagueLoginUserNfc.idx,
          score: previousLeagueLoginUserNfc.score,
          createdAt: new Date('2026-02-03T12:00:00.000Z'),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: previousLeagueOtherUserNfc.idx,
          score: previousLeagueOtherUserNfc.score,
          createdAt: new Date('2026-02-04T12:00:00.000Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: targetLeagueLoginUserNfc.idx,
          score: targetLeagueLoginUserNfc.score,
          createdAt: targetLeagueLoginUserVisitAt,
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: targetLeagueOtherUserNfc.idx,
          score: targetLeagueOtherUserNfc.score,
          createdAt: new Date('2026-03-04T12:00:00.000Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: nextLeagueNfc.idx,
          score: nextLeagueNfc.score,
          createdAt: new Date('2026-04-03T12:00:00.000Z'),
        },
      ]);
      await leagueSeasonResultSeedHelper.seedAll([
        {
          leagueSeasonIdx: inactiveLeagueSeason.idx,
          userIdx: loginUser.idx,
          finalScore: inactiveLeagueNfc.score,
        },
        {
          leagueSeasonIdx: previousLeagueSeason.idx,
          userIdx: loginUser.idx,
          finalScore: previousLeagueLoginUserNfc.score,
        },
        {
          leagueSeasonIdx: previousLeagueSeason.idx,
          userIdx: otherUser.idx,
          finalScore: previousLeagueOtherUserNfc.score,
        },
        {
          leagueSeasonIdx: targetLeagueSeason.idx,
          userIdx: otherUser.idx,
          finalScore: targetLeagueOtherUserNfc.score,
        },
        {
          leagueSeasonIdx: nextLeagueSeason.idx,
          userIdx: loginUser.idx,
          finalScore: nextLeagueNfc.score,
        },
      ]);
      const targetLeagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: targetLeagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: targetLeagueLoginUserNfc.score,
      });
      await userRewardSeedHelper.seed({
        leagueSeasonResultId: targetLeagueSeasonResult.id,
      });

      const response = await testHelper
        .test()
        .get(`/league-season/${targetLeagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const body: LeagueSeasonResultEntity = response.body;

      expect(body.participantCount).toBe(2);
      expect(body.userRanking.seasonRank).toBe(1);
      expect(body.userRanking.seasonScore).toBe(50);
      expect(body.userRanking.seasonLatestVisitAt).toBe(
        targetLeagueLoginUserVisitAt.toISOString(),
      );
      expect(body.userRanking.cumulativeRank).toBe(2);
      expect(body.userRanking.cumulativeScore).toBe(70);
      expect(body.userRanking.cumulativeLatestVisitAt).toBe(
        targetLeagueLoginUserVisitAt.toISOString(),
      );
    });

    it('400 - league season idx is invalid', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/league-season/invalid-league-season-idx/result')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().get('/league-season/1/result').expect(401);
    });

    it('404 - league season does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/league-season/2147483647/result')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });

    it('404 - inactive league season result is not exposed', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: new Date('2026-05-01T00:00:00.000Z'),
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt: new Date('2026-05-01T00:00:00.000Z'),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Inactive Completed League',
        createdAt: new Date('2026-05-01T00:00:00.000Z'),
        startAt: new Date('2026-06-01T00:00:00.000Z'),
        endAt: new Date('2026-06-07T23:59:59.000Z'),
        activatedAt: null,
        finalizedAt: new Date('2026-06-08T00:00:00.000Z'),
      });
      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: nfc.score,
        createdAt: new Date('2026-06-03T12:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 10,
      });
      await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });

    it('404 - league season result does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const startAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt,
        endAt: new Date(startAt.getTime() + 7 * 24 * 60 * 60 * 1000),
        activatedAt: new Date(),
        finalizedAt: null,
      });

      await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });

    it('404 - league season result user ranking does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-04-01T00:00:00.000Z'),
        endAt: new Date('2026-04-07T23:59:59.000Z'),
        activatedAt: new Date('2026-03-15T00:00:00.000Z'),
        finalizedAt: new Date('2026-04-08T00:00:00.000Z'),
      });
      await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 0,
      });

      await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });

    it('404 - user reward does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const activatedAt = new Date('2026-03-15T00:00:00.000Z');
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
        startAt: new Date('2026-04-01T00:00:00.000Z'),
        endAt: new Date('2026-04-07T23:59:59.000Z'),
        activatedAt,
        finalizedAt: new Date('2026-04-08T00:00:00.000Z'),
      });

      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: nfc.score,
        createdAt: new Date('2026-04-03T12:00:00.000Z'),
      });
      await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 10,
      });

      await testHelper
        .test()
        .get(`/league-season/${leagueSeason.idx}/result`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });
  });

  describe('GET /league-season/result/all', () => {
    it('200 - league season result overview field, user filter, cumulative ranking, and order check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const createdAt = new Date('2025-12-01T00:00:00.000Z');
      const reward = await rewardSeedHelper.seed({
        name: 'Selected reward',
        imagePath: '/reward/selected.png',
        activatedAt: createdAt,
      });
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: createdAt,
      });
      const [
        inactiveLeagueNfc,
        firstLeagueLoginUserNfc,
        firstLeagueOtherUserNfc,
        secondLeagueLoginUserNfc,
        secondLeagueOtherUserNfc,
      ] = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, score: 10, activatedAt: createdAt },
        { placeIdx: place.idx, score: 20, activatedAt: createdAt },
        { placeIdx: place.idx, score: 100, activatedAt: createdAt },
        { placeIdx: place.idx, score: 50, activatedAt: createdAt },
        { placeIdx: place.idx, score: 10, activatedAt: createdAt },
      ]);

      const inactiveLeagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Inactive Completed League',
        createdAt,
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-07T23:59:59.000Z'),
        activatedAt: null,
        finalizedAt: new Date('2026-01-08T00:00:00.000Z'),
      });
      const firstLeagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'First Completed League',
        createdAt,
        startAt: new Date('2026-02-01T00:00:00.000Z'),
        endAt: new Date('2026-02-07T23:59:59.000Z'),
        activatedAt: new Date('2026-01-15T00:00:00.000Z'),
        finalizedAt: new Date('2026-02-08T00:00:00.000Z'),
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: inactiveLeagueNfc.idx,
          score: inactiveLeagueNfc.score,
          createdAt: new Date('2026-01-03T12:00:00.000Z'),
        },
        {
          userIdx: loginUser.idx,
          nfcIdx: firstLeagueLoginUserNfc.idx,
          score: firstLeagueLoginUserNfc.score,
          createdAt: new Date('2026-02-03T12:00:00.000Z'),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: firstLeagueOtherUserNfc.idx,
          score: firstLeagueOtherUserNfc.score,
          createdAt: new Date('2026-02-04T12:00:00.000Z'),
        },
      ]);
      const inactiveLeagueSeasonResult =
        await leagueSeasonResultSeedHelper.seed({
          leagueSeasonIdx: inactiveLeagueSeason.idx,
          userIdx: loginUser.idx,
          finalScore: inactiveLeagueNfc.score,
        });
      const [firstLeagueSeasonResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          {
            leagueSeasonIdx: firstLeagueSeason.idx,
            userIdx: loginUser.idx,
            finalScore: firstLeagueLoginUserNfc.score,
          },
          {
            leagueSeasonIdx: firstLeagueSeason.idx,
            userIdx: otherUser.idx,
            finalScore: firstLeagueOtherUserNfc.score,
          },
        ]);
      const firstUserReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: firstLeagueSeasonResult.id,
      });
      await userRewardSeedHelper.seed({
        leagueSeasonResultId: inactiveLeagueSeasonResult.id,
      });

      const secondLeagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Second Completed League',
        createdAt,
        startAt: new Date('2026-03-01T00:00:00.000Z'),
        endAt: new Date('2026-03-07T23:59:59.000Z'),
        activatedAt: new Date('2026-02-15T00:00:00.000Z'),
        finalizedAt: new Date('2026-03-08T00:00:00.000Z'),
        rewardOptionList: [{ rewardIdx: reward.idx, targetRank: 1 }],
      });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          nfcIdx: secondLeagueLoginUserNfc.idx,
          score: secondLeagueLoginUserNfc.score,
          createdAt: new Date('2026-03-03T12:00:00.000Z'),
        },
        {
          userIdx: otherUser.idx,
          nfcIdx: secondLeagueOtherUserNfc.idx,
          score: secondLeagueOtherUserNfc.score,
          createdAt: new Date('2026-03-04T12:00:00.000Z'),
        },
      ]);
      const [secondLeagueSeasonResult, otherUserSecondLeagueSeasonResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          {
            leagueSeasonIdx: secondLeagueSeason.idx,
            userIdx: loginUser.idx,
            finalScore: secondLeagueLoginUserNfc.score,
          },
          {
            leagueSeasonIdx: secondLeagueSeason.idx,
            userIdx: otherUser.idx,
            finalScore: secondLeagueOtherUserNfc.score,
          },
        ]);
      const secondUserReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: secondLeagueSeasonResult.id,
      });
      const selectedAt = new Date('2026-03-09T00:00:00.000Z');
      await testHelper.getPrisma().userReward.update({
        where: { id: secondUserReward.id },
        data: { rewardIdx: reward.idx, selectedAt },
      });

      const descendingResponse = await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);
      const ascendingResponse = await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 1, order: 'asc' })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const descendingBody: LeagueSeasonResultOverviewEntity[] =
        descendingResponse.body.leagueSeasonResultOverviewList;
      const ascendingBody: LeagueSeasonResultOverviewEntity[] =
        ascendingResponse.body.leagueSeasonResultOverviewList;

      expect(descendingResponse.body.hasNext).toBe(false);
      expect(ascendingResponse.body.hasNext).toBe(false);
      expect(descendingBody).toHaveLength(2);
      expect(descendingBody.map(({ id }) => id)).toStrictEqual([
        secondLeagueSeasonResult.id,
        firstLeagueSeasonResult.id,
      ]);
      expect(ascendingBody.map(({ id }) => id)).toStrictEqual([
        firstLeagueSeasonResult.id,
        secondLeagueSeasonResult.id,
      ]);
      expect(
        descendingBody.some(
          ({ id }) => id === otherUserSecondLeagueSeasonResult.id,
        ),
      ).toBe(false);
      expect(
        descendingBody.some(({ id }) => id === inactiveLeagueSeasonResult.id),
      ).toBe(false);
      expect(descendingBody[0].leagueSeason.idx).toBe(secondLeagueSeason.idx);
      expect(descendingBody[0].leagueSeason.name).toBe(secondLeagueSeason.name);
      expect(descendingBody[0].leagueSeason.startAt).toBe(
        secondLeagueSeason.startAt.toISOString(),
      );
      expect(descendingBody[0].leagueSeason.endAt).toBe(
        secondLeagueSeason.endAt.toISOString(),
      );
      expect(descendingBody[0].leagueSeason.activatedAt).toBe(
        secondLeagueSeason.activatedAt?.toISOString(),
      );
      expect(descendingBody[0].leagueSeason.createdAt).toBe(
        secondLeagueSeason.createdAt.toISOString(),
      );
      expect(descendingBody[0].leagueSeason.rewardOptionList).toHaveLength(1);
      expect(
        descendingBody[0].leagueSeason.rewardOptionList[0].reward.idx,
      ).toBe(reward.idx);
      expect(descendingBody[0].userRanking.seasonRank).toBe(1);
      expect(descendingBody[0].userRanking.seasonScore).toBe(50);
      expect(descendingBody[0].userRanking.cumulativeRank).toBe(2);
      expect(descendingBody[0].userRanking.cumulativeScore).toBe(70);
      expect(descendingBody[0].userReward.id).toBe(secondUserReward.id);
      expect(descendingBody[0].userReward.rewardIdx).toBe(reward.idx);
      expect(descendingBody[0].userReward.selectedAt).toBe(
        selectedAt.toISOString(),
      );
      expect(descendingBody[0].userReward.issuedAt).toBeNull();
      expect(descendingBody[1].leagueSeason.idx).toBe(firstLeagueSeason.idx);
      expect(descendingBody[1].userRanking.seasonRank).toBe(2);
      expect(descendingBody[1].userRanking.seasonScore).toBe(20);
      expect(descendingBody[1].userRanking.cumulativeRank).toBe(2);
      expect(descendingBody[1].userRanking.cumulativeScore).toBe(20);
      expect(descendingBody[1].userReward.id).toBe(firstUserReward.id);
      expect(descendingBody[1].userReward.rewardIdx).toBeNull();
      expect(descendingBody[1].userReward.selectedAt).toBeNull();
      expect(descendingBody[1].userReward.issuedAt).toBeNull();
    });

    it('200 - pagination check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const createdAt = new Date('2024-12-01T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt: createdAt,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt: createdAt,
      });
      const firstStartAt = new Date('2025-01-01T00:00:00.000Z').getTime();
      const leagueSeasonList = await leagueSeasonSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => {
          const startAt = new Date(
            firstStartAt + index * 10 * 24 * 60 * 60 * 1000,
          );
          const endAt = new Date(startAt.getTime() + 6 * 24 * 60 * 60 * 1000);

          return {
            name: `Completed League ${index + 1}`,
            createdAt,
            startAt,
            endAt,
            activatedAt: createdAt,
            finalizedAt: new Date(endAt.getTime() + 24 * 60 * 60 * 1000),
          };
        }),
      );
      const leagueSeasonResultIdList: string[] = [];

      for (const [index, leagueSeason] of leagueSeasonList.entries()) {
        await placeVisitSeedHelper.seed({
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          createdAt: new Date(
            leagueSeason.startAt.getTime() + 24 * 60 * 60 * 1000,
          ),
        });
        const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
          leagueSeasonIdx: leagueSeason.idx,
          userIdx: loginUser.idx,
          finalScore: nfc.score,
        });
        await userRewardSeedHelper.seed({
          leagueSeasonResultId: leagueSeasonResult.id,
        });
        leagueSeasonResultIdList.push(leagueSeasonResult.id);
      }

      const firstPageResponse = await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 2 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const firstPageBody: LeagueSeasonResultOverviewEntity[] =
        firstPageResponse.body.leagueSeasonResultOverviewList;
      const secondPageBody: LeagueSeasonResultOverviewEntity[] =
        secondPageResponse.body.leagueSeasonResultOverviewList;

      expect(firstPageResponse.body.hasNext).toBe(true);
      expect(firstPageBody).toHaveLength(10);
      expect(firstPageBody.map(({ id }) => id)).toStrictEqual(
        leagueSeasonResultIdList.slice(1).reverse(),
      );
      expect(secondPageResponse.body.hasNext).toBe(false);
      expect(secondPageBody).toHaveLength(1);
      expect(secondPageBody[0].id).toBe(leagueSeasonResultIdList[0]);
      expect(firstPageBody.some(({ id }) => id === secondPageBody[0].id)).toBe(
        false,
      );
    });

    it('200 - inactive league season result is excluded from participation history', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const activatedAt = new Date('2026-01-15T00:00:00.000Z');
      const place = await placeSeedHelper.seed({
        type: PlaceType.CAFE,
        activatedAt,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        activatedAt,
      });
      const inactiveLeagueSeason = await leagueSeasonSeedHelper.seed({
        name: 'Inactive Participation History',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        startAt: new Date('2026-02-01T00:00:00.000Z'),
        endAt: new Date('2026-02-07T23:59:59.000Z'),
        activatedAt: null,
        finalizedAt: new Date('2026-02-08T00:00:00.000Z'),
      });
      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: nfc.score,
        createdAt: new Date('2026-02-03T12:00:00.000Z'),
      });
      const inactiveLeagueSeasonResult =
        await leagueSeasonResultSeedHelper.seed({
          leagueSeasonIdx: inactiveLeagueSeason.idx,
          userIdx: loginUser.idx,
          finalScore: nfc.score,
        });
      await userRewardSeedHelper.seed({
        leagueSeasonResultId: inactiveLeagueSeasonResult.id,
      });

      const response = await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        hasNext: false,
        leagueSeasonResultOverviewList: [],
      });
    });

    it('400 - page is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/league-season/result/all')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('400 - page is invalid', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 0 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('400 - order is invalid', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 1, order: 'latest' })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 1 })
        .expect(401);
    });

    it('404 - league season result user ranking does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-04-01T00:00:00.000Z'),
        endAt: new Date('2026-04-07T23:59:59.000Z'),
        activatedAt: new Date('2026-03-15T00:00:00.000Z'),
        finalizedAt: new Date('2026-04-08T00:00:00.000Z'),
      });
      await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 0,
      });

      await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });

    it('404 - user reward does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const activatedAt = new Date('2026-03-15T00:00:00.000Z');
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
        startAt: new Date('2026-04-01T00:00:00.000Z'),
        endAt: new Date('2026-04-07T23:59:59.000Z'),
        activatedAt,
        finalizedAt: new Date('2026-04-08T00:00:00.000Z'),
      });

      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: nfc.score,
        createdAt: new Date('2026-04-03T12:00:00.000Z'),
      });
      await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 10,
      });

      await testHelper
        .test()
        .get('/league-season/result/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });
  });
});
