import { BatchServerModule } from '@batch/batch-server.module';
import { LeagueSeasonResultCronService } from '@batch/league-season-result-cron/league-season-result-cron.service';
import { LeagueSeasonSeedHelper } from '@libs/testing/seed/league-season/league-season.seed';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceVisitSeedHelper } from '@libs/testing/seed/place-visit/place-visit.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { RewardSeedHelper } from '@libs/testing/seed/reward/reward.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { TestHelper } from './setup/test.helper';

describe('League Season Result Cron E2E test', () => {
  const testHelper = TestHelper.create(BatchServerModule);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);
  const placeVisitSeedHelper = testHelper.seedHelper(PlaceVisitSeedHelper);
  const rewardSeedHelper = testHelper.seedHelper(RewardSeedHelper);
  const leagueSeasonSeedHelper = testHelper.seedHelper(LeagueSeasonSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('finalizeLeagueSeasonResultByLeagueSeasonIdx', () => {
    it('exclude soft deleted place visits from final score and create reward only for eligible rank', async () => {
      const [firstUser, secondUser, deletedVisitOnlyUser] =
        await userSeedHelper.seedAll([
          { nickname: '배치 1위 사용자' },
          { nickname: '배치 2위 사용자' },
          { nickname: '삭제 방문만 있는 사용자' },
        ]);
      const reward = await rewardSeedHelper.seed({
        name: '배치 1위 리워드',
        activatedAt: new Date('2026-06-01T00:00:00.000Z'),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '삭제 방문 제외 배치 리그',
        startAt: new Date('2026-07-01T00:00:00.000Z'),
        endAt: new Date('2026-07-15T23:59:59.999Z'),
        activatedAt: new Date('2026-06-30T00:00:00.000Z'),
        finalizedAt: null,
        rewardOptionList: [{ rewardIdx: reward.idx, targetRank: 1 }],
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      await placeVisitSeedHelper.seedAll([
        {
          userIdx: firstUser.idx,
          nfcIdx: nfc.idx,
          score: 30,
          createdAt: new Date('2026-07-03T10:00:00.000Z'),
        },
        {
          userIdx: firstUser.idx,
          nfcIdx: nfc.idx,
          score: 100,
          createdAt: new Date('2026-07-04T10:00:00.000Z'),
          deletedAt: new Date('2026-07-16T00:00:00.000Z'),
        },
        {
          userIdx: secondUser.idx,
          nfcIdx: nfc.idx,
          score: 20,
          createdAt: new Date('2026-07-05T10:00:00.000Z'),
        },
        {
          userIdx: deletedVisitOnlyUser.idx,
          nfcIdx: nfc.idx,
          score: 200,
          createdAt: new Date('2026-07-06T10:00:00.000Z'),
          deletedAt: new Date('2026-07-16T00:00:00.000Z'),
        },
        {
          userIdx: secondUser.idx,
          nfcIdx: nfc.idx,
          score: 300,
          createdAt: new Date('2026-07-16T00:00:00.000Z'),
        },
      ]);
      const finalizedAt = new Date('2026-07-16T01:00:00.000Z');
      const cronService = testHelper.get<LeagueSeasonResultCronService>(
        LeagueSeasonResultCronService,
      );

      await cronService.finalizeLeagueSeasonResultByLeagueSeasonIdx(
        leagueSeason.idx,
        finalizedAt,
      );

      const updatedLeagueSeason = await testHelper
        .getPrisma()
        .leagueSeason.findUniqueOrThrow({ where: { idx: leagueSeason.idx } });
      const leagueSeasonResultList = await testHelper
        .getPrisma()
        .leagueSeasonResult.findMany({
          where: { leagueSeasonIdx: leagueSeason.idx },
          orderBy: { finalScore: 'desc' },
        });
      const userRewardList = await testHelper.getPrisma().userReward.findMany({
        include: { leagueSeasonResult: true },
      });

      expect(updatedLeagueSeason.finalizedAt).toEqual(finalizedAt);
      expect(leagueSeasonResultList).toHaveLength(2);
      expect(
        leagueSeasonResultList.map(({ userIdx, finalScore }) => ({
          userIdx,
          finalScore,
        })),
      ).toStrictEqual([
        { userIdx: firstUser.idx, finalScore: 30 },
        { userIdx: secondUser.idx, finalScore: 20 },
      ]);
      expect(
        leagueSeasonResultList.some(
          ({ userIdx }) => userIdx === deletedVisitOnlyUser.idx,
        ),
      ).toBe(false);
      expect(userRewardList).toHaveLength(1);
      expect(userRewardList[0].leagueSeasonResult.userIdx).toBe(firstUser.idx);
      expect(userRewardList[0].rewardIdx).toBeNull();
      expect(userRewardList[0].selectedAt).toBeNull();
      expect(userRewardList[0].issuedAt).toBeNull();
    });

    it('finalize league season without result when every place visit is deleted', async () => {
      const user = await userSeedHelper.seed({
        nickname: '전부 삭제된 방문 사용자',
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '결과 없는 배치 리그',
        startAt: new Date('2026-05-01T00:00:00.000Z'),
        endAt: new Date('2026-05-15T23:59:59.999Z'),
        activatedAt: new Date('2026-04-30T00:00:00.000Z'),
        finalizedAt: null,
      });
      const place = await placeSeedHelper.seed({});
      const nfc = await nfcSeedHelper.seed({ placeIdx: place.idx });
      await placeVisitSeedHelper.seed({
        userIdx: user.idx,
        nfcIdx: nfc.idx,
        score: 10,
        createdAt: new Date('2026-05-05T10:00:00.000Z'),
        deletedAt: new Date('2026-05-16T00:00:00.000Z'),
      });
      const finalizedAt = new Date('2026-05-16T01:00:00.000Z');
      const cronService = testHelper.get<LeagueSeasonResultCronService>(
        LeagueSeasonResultCronService,
      );

      await cronService.finalizeLeagueSeasonResultByLeagueSeasonIdx(
        leagueSeason.idx,
        finalizedAt,
      );

      const updatedLeagueSeason = await testHelper
        .getPrisma()
        .leagueSeason.findUniqueOrThrow({ where: { idx: leagueSeason.idx } });
      const leagueSeasonResultCount = await testHelper
        .getPrisma()
        .leagueSeasonResult.count({
          where: { leagueSeasonIdx: leagueSeason.idx },
        });
      const userRewardCount = await testHelper.getPrisma().userReward.count();

      expect(updatedLeagueSeason.finalizedAt).toEqual(finalizedAt);
      expect(leagueSeasonResultCount).toBe(0);
      expect(userRewardCount).toBe(0);
    });
  });
});
