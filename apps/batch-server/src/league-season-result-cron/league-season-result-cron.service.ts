import { Locker } from '@libs/common/decorator/locker.decorator';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { PlaceVisitCoreService } from '@libs/core/place-visit/place-visit-core.service';
import { UserRewardCoreService } from '@libs/core/user-reward/user-reward-core.service';
import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

type FinalizeLeagueSeasonResult = {
  targetCount: number;
  successCount: number;
  failureCount: number;
};

@Injectable()
export class LeagueSeasonResultCronService {
  constructor(
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
    private readonly placeVisitCoreService: PlaceVisitCoreService,
    private readonly userRewardCoreService: UserRewardCoreService,
    private readonly discordWebhookService: DiscordWebhookService,
  ) {}

  public async finalizeLeagueSeasonResultAll(): Promise<void> {
    const now = new Date();
    const leagueSeasonList =
      await this.leagueSeasonCoreService.getLeagueSeasonAll({
        order: 'asc',
        activated: true,
        endAtBefore: now,
        finalized: false,
      });

    if (leagueSeasonList.length === 0) {
      return;
    }

    let targetCount = 0;
    let successCount = 0;
    let failureCount = 0;
    const failedLeagueSeasonIdxList: number[] = [];

    for (const leagueSeason of leagueSeasonList) {
      try {
        const result = await this.finalizeLeagueSeasonResultByLeagueSeasonIdx(
          leagueSeason.idx,
          now,
        );
        targetCount += result.targetCount;
        successCount += result.successCount;
        failureCount += result.failureCount;
      } catch {
        failedLeagueSeasonIdxList.push(leagueSeason.idx);
      }
    }

    await this.discordWebhookService.sendWebhookMessage(
      '리그 시즌 종료 배치 완료',
      [
        `대상: ${targetCount}개`,
        `성공: ${successCount}개`,
        `실패: ${failureCount}개`,
        failedLeagueSeasonIdxList.length > 0
          ? `실패 시즌: ${failedLeagueSeasonIdxList.join(', ')}`
          : null,
      ]
        .filter((message): message is string => message !== null)
        .join('\n'),
      DiscordWebhookContext.BATCH_SERVER,
    );
  }

  @Locker({
    key: (leagueSeasonIdx: number) => `league-season-result:${leagueSeasonIdx}`,
  })
  @Transactional()
  public async finalizeLeagueSeasonResultByLeagueSeasonIdx(
    leagueSeasonIdx: number,
    now: Date,
  ): Promise<FinalizeLeagueSeasonResult> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(leagueSeasonIdx);

    if (
      !leagueSeason ||
      !leagueSeason.activatedAt ||
      leagueSeason.finalizedAt ||
      leagueSeason.endAt >= now
    ) {
      return { targetCount: 0, successCount: 0, failureCount: 0 };
    }

    const userScoreList =
      await this.placeVisitCoreService.getPlaceVisitUserScoreAllByDatePeriod(
        leagueSeason.startAt,
        leagueSeason.endAt,
      );

    const leagueSeasonResultIdByUserIdx = new Map<number, string>();
    for (const userScore of userScoreList) {
      const leagueSeasonResult =
        await this.leagueSeasonCoreService.createLeagueSeasonResult({
          leagueSeasonIdx: leagueSeason.idx,
          userIdx: userScore.userIdx,
          finalScore: userScore.score,
        });
      leagueSeasonResultIdByUserIdx.set(
        userScore.userIdx,
        leagueSeasonResult.id,
      );
    }

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(
      leagueSeason.idx,
      { finalizedAt: now },
    );

    const rewardTargetRankSet = new Set(
      leagueSeason.rewardOptionList.map(
        (rewardOption) => rewardOption.targetRank,
      ),
    );
    if (rewardTargetRankSet.size === 0) {
      return { targetCount: 0, successCount: 0, failureCount: 0 };
    }

    const userRankingList =
      await this.leagueSeasonCoreService.getLeagueSeasonResultUserRankingAllByLeagueSeasonIdx(
        leagueSeason.idx,
      );
    const rewardTargetUserRankingList = userRankingList.filter((userRanking) =>
      rewardTargetRankSet.has(userRanking.seasonRank),
    );
    let successCount = 0;

    for (const userRanking of rewardTargetUserRankingList) {
      const leagueSeasonResultId = leagueSeasonResultIdByUserIdx.get(
        userRanking.userIdx,
      );
      if (!leagueSeasonResultId) {
        throw new Error(
          `League season result not found (leagueSeasonIdx: ${leagueSeason.idx}, userIdx: ${userRanking.userIdx})`,
        );
      }

      await this.userRewardCoreService.createUserReward({
        leagueSeasonResultId,
        rewardIdx: null,
        selectedAt: null,
        issuedAt: null,
      });
      successCount++;
    }

    return {
      targetCount: rewardTargetUserRankingList.length,
      successCount,
      failureCount: rewardTargetUserRankingList.length - successCount,
    };
  }
}
