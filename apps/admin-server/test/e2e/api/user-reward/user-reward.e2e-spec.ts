import { AdminServerModule } from '@admin/admin-server.module';
import { UserRewardEntity } from '@admin/api/user-reward/entity/user-reward.entity';
import { MailService } from '@libs/common/modules/mail/mail.service';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { UserRewardStatus } from '@libs/core/user-reward/constants/user-reward-status.enum';
import { LeagueSeasonResultSeedHelper } from '@libs/testing/seed/league-season/league-season-result.seed';
import { LeagueSeasonSeedHelper } from '@libs/testing/seed/league-season/league-season.seed';
import { RewardSeedHelper } from '@libs/testing/seed/reward/reward.seed';
import { UserRewardSeedHelper } from '@libs/testing/seed/user-reward/user-reward.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { randomUUID } from 'crypto';
import { TestHelper } from '../../setup/test.helper';

describe('User Reward E2E test', () => {
  const mailService = {
    sendMail: jest.fn(),
  };
  const testHelper = TestHelper.create(AdminServerModule);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);
  const rewardSeedHelper = testHelper.seedHelper(RewardSeedHelper);
  const leagueSeasonSeedHelper = testHelper.seedHelper(LeagueSeasonSeedHelper);
  const leagueSeasonResultSeedHelper = testHelper.seedHelper(
    LeagueSeasonResultSeedHelper,
  );
  const userRewardSeedHelper = testHelper.seedHelper(UserRewardSeedHelper);

  testHelper.overrideProvider(MailService).useValue(mailService);

  beforeEach(async () => {
    mailService.sendMail.mockClear();
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /user-reward/all', () => {
    it('200 - field, status, and league season filter check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [user1, user2] = await userSeedHelper.seedAll([
        { nickname: '선택한 사용자' },
        { nickname: '선택하지 않은 사용자' },
      ]);
      const reward = await rewardSeedHelper.seed({
        name: '선택한 리워드',
        activatedAt: new Date(),
      });
      const [targetLeagueSeason, otherLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            name: '조회 대상 리그',
            startAt: new Date('2026-01-01T00:00:00.000Z'),
            endAt: new Date('2026-01-15T23:59:59.999Z'),
            activatedAt: new Date(),
            finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
          },
          {
            name: '다른 리그',
            startAt: new Date('2026-02-01T00:00:00.000Z'),
            endAt: new Date('2026-02-15T23:59:59.999Z'),
            activatedAt: new Date(),
            finalizedAt: new Date('2026-02-16T00:00:00.000Z'),
          },
        ]);
      const [targetResult, otherResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          {
            leagueSeasonIdx: targetLeagueSeason.idx,
            userIdx: user1.idx,
            finalScore: 120,
          },
          {
            leagueSeasonIdx: otherLeagueSeason.idx,
            userIdx: user2.idx,
            finalScore: 80,
          },
        ]);
      const [targetUserReward] = await userRewardSeedHelper.seedAll([
        {
          leagueSeasonResultId: targetResult.id,
          rewardIdx: reward.idx,
          selectedAt: new Date(),
        },
        {
          leagueSeasonResultId: otherResult.id,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({
          page: 1,
          status: UserRewardStatus.PENDING_ISSUANCE,
          leagueSeasonIdx: targetLeagueSeason.idx,
        })
        .expect(200);

      expect(response.body.hasNext).toBe(false);
      expect(response.body.userRewardList).toHaveLength(1);

      const userReward: UserRewardEntity = response.body.userRewardList[0];

      expect(userReward.id).toBe(targetUserReward.id);
      expect(userReward.createdAt).toBeDefined();
      expect(userReward.selectedAt).toBeDefined();
      expect(userReward.issuedAt).toBeNull();
      expect(userReward.reward?.idx).toBe(reward.idx);
      expect(userReward.reward?.name).toBe(reward.name);
      expect(userReward.leagueSeasonResult.id).toBe(targetResult.id);
      expect(userReward.leagueSeasonResult.leagueSeason.idx).toBe(
        targetLeagueSeason.idx,
      );
      expect(userReward.user.idx).toBe(user1.idx);
      expect(userReward.user.nickname).toBe(user1.nickname);
    });

    it('200 - pagination check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const userList = await userSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => ({
          nickname: `페이지 사용자 ${index + 1}`,
        })),
      );
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '페이지 리그',
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
      });
      const leagueSeasonResultList = await leagueSeasonResultSeedHelper.seedAll(
        userList.map((user, index) => ({
          leagueSeasonIdx: leagueSeason.idx,
          userIdx: user.idx,
          finalScore: 100 + index,
        })),
      );
      await userRewardSeedHelper.seedAll(
        leagueSeasonResultList.map((leagueSeasonResult) => ({
          leagueSeasonResultId: leagueSeasonResult.id,
        })),
      );

      const firstPageResponse = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 2 })
        .expect(200);

      expect(firstPageResponse.body.hasNext).toBe(true);
      expect(firstPageResponse.body.userRewardList).toHaveLength(10);
      expect(secondPageResponse.body.hasNext).toBe(false);
      expect(secondPageResponse.body.userRewardList).toHaveLength(1);
    });

    it('200 - returns every status when league season idx is not provided', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [unselectedUser, pendingUser, issuedUser] =
        await userSeedHelper.seedAll([
          { nickname: '미선택 사용자' },
          { nickname: '선택 사용자' },
          { nickname: '발급 사용자' },
        ]);
      const reward = await rewardSeedHelper.seed({ activatedAt: new Date() });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '전체 상태 리그',
        startAt: new Date('2026-03-01T00:00:00.000Z'),
        endAt: new Date('2026-03-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-03-16T00:00:00.000Z'),
      });
      const [unselectedResult, pendingResult, issuedResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          { leagueSeasonIdx: leagueSeason.idx, userIdx: unselectedUser.idx },
          { leagueSeasonIdx: leagueSeason.idx, userIdx: pendingUser.idx },
          { leagueSeasonIdx: leagueSeason.idx, userIdx: issuedUser.idx },
        ]);
      const [unselectedUserReward, pendingUserReward, issuedUserReward] =
        await userRewardSeedHelper.seedAll([
          { leagueSeasonResultId: unselectedResult.id },
          {
            leagueSeasonResultId: pendingResult.id,
            rewardIdx: reward.idx,
            selectedAt: new Date(),
          },
          {
            leagueSeasonResultId: issuedResult.id,
            rewardIdx: reward.idx,
            selectedAt: new Date(),
            issuedAt: new Date(),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const userRewardIdList: string[] = response.body.userRewardList.map(
        (userReward: UserRewardEntity) => userReward.id,
      );

      expect(response.body.hasNext).toBe(false);
      expect(userRewardIdList).toEqual(
        expect.arrayContaining([
          unselectedUserReward.id,
          pendingUserReward.id,
          issuedUserReward.id,
        ]),
      );
    });

    it('200 - status filter check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [unselectedUser, pendingUser, issuedUser] =
        await userSeedHelper.seedAll([
          { nickname: '상태 미선택 사용자' },
          { nickname: '상태 선택 사용자' },
          { nickname: '상태 발급 사용자' },
        ]);
      const reward = await rewardSeedHelper.seed({ activatedAt: new Date() });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '상태 필터 리그',
        startAt: new Date('2026-07-01T00:00:00.000Z'),
        endAt: new Date('2026-07-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-07-16T00:00:00.000Z'),
      });
      const [unselectedResult, pendingResult, issuedResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          { leagueSeasonIdx: leagueSeason.idx, userIdx: unselectedUser.idx },
          { leagueSeasonIdx: leagueSeason.idx, userIdx: pendingUser.idx },
          { leagueSeasonIdx: leagueSeason.idx, userIdx: issuedUser.idx },
        ]);
      const [unselectedUserReward, pendingUserReward, issuedUserReward] =
        await userRewardSeedHelper.seedAll([
          { leagueSeasonResultId: unselectedResult.id },
          {
            leagueSeasonResultId: pendingResult.id,
            rewardIdx: reward.idx,
            selectedAt: new Date(),
          },
          {
            leagueSeasonResultId: issuedResult.id,
            rewardIdx: reward.idx,
            selectedAt: new Date(),
            issuedAt: new Date(),
          },
        ]);

      const unselectedResponse = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, status: UserRewardStatus.UNSELECTED })
        .expect(200);
      const pendingResponse = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, status: UserRewardStatus.PENDING_ISSUANCE })
        .expect(200);
      const issuedResponse = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, status: UserRewardStatus.ISSUED })
        .expect(200);

      expect(unselectedResponse.body.userRewardList).toHaveLength(1);
      expect(unselectedResponse.body.userRewardList[0].id).toBe(
        unselectedUserReward.id,
      );
      expect(pendingResponse.body.userRewardList).toHaveLength(1);
      expect(pendingResponse.body.userRewardList[0].id).toBe(
        pendingUserReward.id,
      );
      expect(issuedResponse.body.userRewardList).toHaveLength(1);
      expect(issuedResponse.body.userRewardList[0].id).toBe(
        issuedUserReward.id,
      );
    });

    it('200 - league season filter includes every reward status in that season', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [unselectedUser, issuedUser, otherUser] =
        await userSeedHelper.seedAll([
          { nickname: '시즌 미선택 사용자' },
          { nickname: '시즌 발급 사용자' },
          { nickname: '다른 시즌 사용자' },
        ]);
      const reward = await rewardSeedHelper.seed({ activatedAt: new Date() });
      const [targetLeagueSeason, otherLeagueSeason] =
        await leagueSeasonSeedHelper.seedAll([
          {
            name: '시즌 필터 대상 리그',
            startAt: new Date('2026-04-01T00:00:00.000Z'),
            endAt: new Date('2026-04-15T23:59:59.999Z'),
            activatedAt: new Date(),
            finalizedAt: new Date('2026-04-16T00:00:00.000Z'),
          },
          {
            name: '시즌 필터 제외 리그',
            startAt: new Date('2026-05-01T00:00:00.000Z'),
            endAt: new Date('2026-05-15T23:59:59.999Z'),
            activatedAt: new Date(),
            finalizedAt: new Date('2026-05-16T00:00:00.000Z'),
          },
        ]);
      const [unselectedResult, issuedResult, otherResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          {
            leagueSeasonIdx: targetLeagueSeason.idx,
            userIdx: unselectedUser.idx,
          },
          { leagueSeasonIdx: targetLeagueSeason.idx, userIdx: issuedUser.idx },
          { leagueSeasonIdx: otherLeagueSeason.idx, userIdx: otherUser.idx },
        ]);
      const [unselectedUserReward, issuedUserReward, otherUserReward] =
        await userRewardSeedHelper.seedAll([
          { leagueSeasonResultId: unselectedResult.id },
          {
            leagueSeasonResultId: issuedResult.id,
            rewardIdx: reward.idx,
            selectedAt: new Date(),
            issuedAt: new Date(),
          },
          { leagueSeasonResultId: otherResult.id },
        ]);

      const response = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, leagueSeasonIdx: targetLeagueSeason.idx })
        .expect(200);

      const userRewardIdList: string[] = response.body.userRewardList.map(
        (userReward: UserRewardEntity) => userReward.id,
      );

      expect(userRewardIdList).toEqual(
        expect.arrayContaining([unselectedUserReward.id, issuedUserReward.id]),
      );
      expect(userRewardIdList).not.toContain(otherUserReward.id);
    });

    it('200 - order check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [firstUser, secondUser] = await userSeedHelper.seedAll([
        { nickname: '오래된 리워드 사용자' },
        { nickname: '최근 리워드 사용자' },
      ]);
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '정렬 리그',
        startAt: new Date('2026-06-01T00:00:00.000Z'),
        endAt: new Date('2026-06-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-06-16T00:00:00.000Z'),
      });
      const [firstResult, secondResult] =
        await leagueSeasonResultSeedHelper.seedAll([
          { leagueSeasonIdx: leagueSeason.idx, userIdx: firstUser.idx },
          { leagueSeasonIdx: leagueSeason.idx, userIdx: secondUser.idx },
        ]);
      const [firstUserReward, secondUserReward] =
        await userRewardSeedHelper.seedAll([
          { leagueSeasonResultId: firstResult.id },
          { leagueSeasonResultId: secondResult.id },
        ]);
      await testHelper.getPrisma().userReward.update({
        where: { id: firstUserReward.id },
        data: { createdAt: new Date('2026-06-17T00:00:00.000Z') },
      });
      await testHelper.getPrisma().userReward.update({
        where: { id: secondUserReward.id },
        data: { createdAt: new Date('2026-06-18T00:00:00.000Z') },
      });

      const ascendingResponse = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'asc' })
        .expect(200);
      const descendingResponse = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'desc' })
        .expect(200);

      expect(ascendingResponse.body.userRewardList[0].id).toBe(
        firstUserReward.id,
      );
      expect(descendingResponse.body.userRewardList[0].id).toBe(
        secondUserReward.id,
      );
    });

    it('200 - returns empty list when user rewards do not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(response.body.hasNext).toBe(false);
      expect(response.body.userRewardList).toEqual([]);
    });

    it('400 - page is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('400 - user reward status is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, status: 'invalid-status' })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .get('/user-reward/all')
        .query({ page: 1 })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/user-reward/all')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .query({ page: 1 })
        .expect(403);
    });
  });

  describe('GET /user-reward/:id', () => {
    it('200 - selected user reward field check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({ nickname: '상세 조회 사용자' });
      const reward = await rewardSeedHelper.seed({
        name: '상세 조회 리워드',
        activatedAt: new Date(),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '상세 조회 리그',
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
        finalScore: 250,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/user-reward/${userReward.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const responseUserReward: UserRewardEntity = response.body;

      expect(responseUserReward.id).toBe(userReward.id);
      expect(responseUserReward.selectedAt).toBeDefined();
      expect(responseUserReward.issuedAt).toBeNull();
      expect(responseUserReward.reward?.idx).toBe(reward.idx);
      expect(responseUserReward.leagueSeasonResult.id).toBe(
        leagueSeasonResult.id,
      );
      expect(responseUserReward.leagueSeasonResult.leagueSeason.idx).toBe(
        leagueSeason.idx,
      );
      expect(responseUserReward.user.idx).toBe(user.idx);
      expect(responseUserReward.user.nickname).toBe(user.nickname);
    });

    it('200 - unselected user reward has no reward or selection dates', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({
        nickname: '미선택 상세 사용자',
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '미선택 상세 리그',
        startAt: new Date('2026-02-01T00:00:00.000Z'),
        endAt: new Date('2026-02-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-02-16T00:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      const response = await testHelper
        .test()
        .get(`/user-reward/${userReward.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const responseUserReward: UserRewardEntity = response.body;

      expect(responseUserReward.id).toBe(userReward.id);
      expect(responseUserReward.reward).toBeNull();
      expect(responseUserReward.selectedAt).toBeNull();
      expect(responseUserReward.issuedAt).toBeNull();
      expect(responseUserReward.leagueSeasonResult.id).toBe(
        leagueSeasonResult.id,
      );
      expect(responseUserReward.user.idx).toBe(user.idx);
    });

    it('400 - user reward id is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/user-reward/invalid-user-reward-id')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().get(`/user-reward/${randomUUID()}`).expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get(`/user-reward/${randomUUID()}`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - user reward does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get(`/user-reward/${randomUUID()}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('404 - selected reward has been deleted', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({});
      const reward = await rewardSeedHelper.seed({});
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date(),
      });
      await testHelper.getPrisma().reward.update({
        where: { idx: reward.idx },
        data: { deletedAt: new Date() },
      });

      await testHelper
        .test()
        .get(`/user-reward/${userReward.id}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });

  describe('POST /user-reward/:id/issue', () => {
    it('200 - sends reward issue email and updates issued at', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({
        nickname: '리워드 발급 사용자',
      });
      const schoolEmail = 'reward-user@inha.edu';
      await testHelper.get(UserCoreService).updateUserByIdx(user.idx, {
        schoolEmail,
      });
      const reward = await rewardSeedHelper.seed({
        name: '발급 대상 리워드',
        activatedAt: new Date(),
      });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        name: '리워드 발급 리그',
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
        finalScore: 300,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date(),
      });
      const beforeRequest = new Date();

      await testHelper
        .test()
        .post(`/user-reward/${userReward.id}/issue`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const issuedUserReward = await testHelper
        .getPrisma()
        .userReward.findUniqueOrThrow({
          where: { id: userReward.id },
        });

      expect(mailService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailService.sendMail).toHaveBeenCalledWith(
        schoolEmail,
        `[인후] ${leagueSeason.name} 리워드 발급 안내`,
        `<p>${user.nickname}님의 리워드가 발급되었습니다.</p><p>리워드: ${reward.name}</p>`,
      );
      expect(issuedUserReward.issuedAt).not.toBeNull();
      expect(issuedUserReward.issuedAt?.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime(),
      );
    });

    it('400 - user reward id is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/user-reward/invalid-user-reward-id/issue')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .post(`/user-reward/${randomUUID()}/issue`)
        .expect(401);
    });

    it('403 - user school email does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({});
      const reward = await rewardSeedHelper.seed({ activatedAt: new Date() });
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/user-reward/${userReward.id}/issue`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(403);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post(`/user-reward/${randomUUID()}/issue`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - user reward does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post(`/user-reward/${randomUUID()}/issue`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('404 - selected reward has been deleted', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({});
      await testHelper.get(UserCoreService).updateUserByIdx(user.idx, {
        schoolEmail: 'deleted-reward-user@inha.edu',
      });
      const reward = await rewardSeedHelper.seed({});
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date(),
      });
      await testHelper.getPrisma().reward.update({
        where: { idx: reward.idx },
        data: { deletedAt: new Date() },
      });

      await testHelper
        .test()
        .post(`/user-reward/${userReward.id}/issue`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('409 - user reward has already been issued', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({});
      const reward = await rewardSeedHelper.seed({});
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
        rewardIdx: reward.idx,
        selectedAt: new Date(),
        issuedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/user-reward/${userReward.id}/issue`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(409);
    });

    it('409 - user has not selected a reward', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const user = await userSeedHelper.seed({});
      const leagueSeason = await leagueSeasonSeedHelper.seed({
        startAt: new Date('2026-01-01T00:00:00.000Z'),
        endAt: new Date('2026-01-15T23:59:59.999Z'),
        activatedAt: new Date(),
        finalizedAt: new Date('2026-01-16T00:00:00.000Z'),
      });
      const leagueSeasonResult = await leagueSeasonResultSeedHelper.seed({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: user.idx,
      });
      const userReward = await userRewardSeedHelper.seed({
        leagueSeasonResultId: leagueSeasonResult.id,
      });

      await testHelper
        .test()
        .post(`/user-reward/${userReward.id}/issue`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(409);
    });
  });
});
