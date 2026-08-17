import { LeagueSeasonResultSeedHelper } from '@libs/testing/seed/league-season/league-season-result.seed';
import { LeagueSeasonSeedHelper } from '@libs/testing/seed/league-season/league-season.seed';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceVisitSeedHelper } from '@libs/testing/seed/place-visit/place-visit.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { RewardSeedHelper } from '@libs/testing/seed/reward/reward.seed';
import { UserRewardSeedHelper } from '@libs/testing/seed/user-reward/user-reward.seed';
import { AppModule } from '@user/app.module';
import { randomUUID } from 'crypto';
import { TestHelper } from '../../setup/test.helper';

describe('User Reward E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);
  const placeVisitSeedHelper = testHelper.seedHelper(PlaceVisitSeedHelper);
  const rewardSeedHelper = testHelper.seedHelper(RewardSeedHelper);
  const leagueSeasonSeedHelper = testHelper.seedHelper(LeagueSeasonSeedHelper);
  const leagueSeasonResultSeedHelper = testHelper.seedHelper(
    LeagueSeasonResultSeedHelper,
  );
  const userRewardSeedHelper = testHelper.seedHelper(UserRewardSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('PUT /user-reward/:id', () => {
    it('200 - successfully select reward (one of the ones)', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const reward = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        activatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
        rewardOptionList: [
          {
            rewardIdx: reward.idx,
            targetRank: 1,
          },
        ],
      });
      const place = await placeSeedHelper.seed({
        activatedAt: now,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 100,
        activatedAt: now,
      });
      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: nfc.score,
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });
      const beforeRequest = new Date();

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: reward.idx })
        .expect(200);

      const updatedUserReward = await testHelper
        .getPrisma()
        .userReward.findUniqueOrThrow({
          where: { id: userReward.id },
        });

      expect(updatedUserReward.rewardIdx).toBe(reward.idx);
      expect(updatedUserReward.selectedAt).not.toBeNull();
      expect(updatedUserReward.selectedAt?.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime(),
      );
      expect(updatedUserReward.issuedAt).toBeNull();
    });

    it('200 - successfully select reward (one of several)', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const [reward1, reward2] = await rewardSeedHelper.seedAll([
        { activatedAt: new Date() },
        { activatedAt: new Date() },
      ]);
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        activatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
        rewardOptionList: [
          {
            rewardIdx: reward1.idx,
            targetRank: 1,
          },
          {
            rewardIdx: reward2.idx,
            targetRank: 1,
          },
        ],
      });
      const place = await placeSeedHelper.seed({
        activatedAt: now,
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 100,
        activatedAt: now,
      });
      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: nfc.score,
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });
      const beforeRequest = new Date();

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: reward1.idx })
        .expect(200);

      const updatedUserReward = await testHelper
        .getPrisma()
        .userReward.findUniqueOrThrow({
          where: { id: userReward.id },
        });

      expect(updatedUserReward.rewardIdx).toBe(reward1.idx);
      expect(updatedUserReward.selectedAt).not.toBeNull();
      expect(updatedUserReward.selectedAt?.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime(),
      );
      expect(updatedUserReward.issuedAt).toBeNull();
    });

    it('400 - user reward id is not UUID', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .put('/user-reward/invalid-user-reward-id')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: 1 })
        .expect(400);
    });

    it('400 - reward idx is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .put(`/user-reward/${randomUUID()}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({})
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .put(`/user-reward/${randomUUID()}`)
        .send({ rewardIdx: 1 })
        .expect(401);
    });

    it('403 - user is not school verified', async () => {
      const loginUser = testHelper.loginUsers.user1;
      await testHelper.getPrisma().userEmail.delete({
        where: { idx: loginUser.idx },
      });

      const reward = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
        rewardOptionList: [
          {
            rewardIdx: reward.idx,
            targetRank: 1,
          },
        ],
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: 1 })
        .expect(403);
    });

    it('403 - another user cannot select reward', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${otherUser.web.accessToken}`)
        .send({ rewardIdx: 1 })
        .expect(403);
    });

    it('403 - reward is not available for league season', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const [leagueReward, unavailableReward] = await rewardSeedHelper.seedAll([
        { activatedAt: new Date() },
        { activatedAt: new Date() },
      ]);
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
        rewardOptionList: [
          {
            rewardIdx: leagueReward.idx,
            targetRank: 1,
          },
        ],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: now,
      });
      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: 100,
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: unavailableReward.idx })
        .expect(403);
    });

    it('403 - deleted reward option is not available for league season', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const reward = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
        rewardOptionList: [
          {
            rewardIdx: reward.idx,
            targetRank: 1,
            deletedAt: now,
          },
        ],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: now,
      });
      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: 100,
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: reward.idx })
        .expect(403);
    });

    it("403 - reward is not available for user's rank", async () => {
      const loginUser = testHelper.loginUsers.user1;
      const reward = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
        rewardOptionList: [
          {
            rewardIdx: reward.idx,
            targetRank: 2,
          },
        ],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: now,
      });
      await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: nfc.idx,
        score: 100,
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: reward.idx })
        .expect(403);
    });

    it('404 - user reward does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .put(`/user-reward/${randomUUID()}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: 1 })
        .expect(404);
    });

    it('404 - reward does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        activatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: 9999999 })
        .expect(404);
    });

    it('404 - league season result user ranking does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const reward = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        activatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
        rewardOptionList: [
          {
            rewardIdx: reward.idx,
            targetRank: 1,
          },
        ],
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: reward.idx })
        .expect(404);
    });

    it('409 - reward has already been issued', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const reward = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        activatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: now,
        issuedAt: now,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: reward.idx })
        .expect(409);
    });

    it('409 - reward has already been selected', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const reward = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });
      const now = new Date();
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        activatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        finalizedAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: loginUser.idx,
        finalScore: 100,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: now,
      });

      await testHelper
        .test()
        .put(`/user-reward/${userReward.id}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ rewardIdx: reward.idx })
        .expect(409);
    });
  });
});
