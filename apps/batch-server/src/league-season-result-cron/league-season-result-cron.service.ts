import { Locker } from '@libs/common/decorator/locker.decorator';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { PlaceVisitCoreService } from '@libs/core/place-visit/place-visit-core.service';
import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeagueSeasonResultCronService {
  constructor(
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
    private readonly placeVisitCoreService: PlaceVisitCoreService,
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

    for (const leagueSeason of leagueSeasonList) {
      try {
        await this.finalizeLeagueSeasonResultByLeagueSeasonIdx(
          leagueSeason.idx,
          now,
        );
      } catch (error) {
        const message = `League season result batch failed (leagueSeasonIdx: ${leagueSeason.idx})`;
        this.discordWebhookService.sendErrorMessage(
          '리그 결과 배치 실패 알림',
          message,
          error instanceof Error ? error : new Error(String(error)),
          DiscordWebhookContext.BATCH_SERVER,
        );
      }
    }
  }

  @Locker({
    key: (leagueSeasonIdx: number) => `league-season-result:${leagueSeasonIdx}`,
  })
  @Transactional()
  public async finalizeLeagueSeasonResultByLeagueSeasonIdx(
    leagueSeasonIdx: number,
    now: Date,
  ): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(leagueSeasonIdx);

    if (
      !leagueSeason ||
      !leagueSeason.activatedAt ||
      leagueSeason.finalizedAt ||
      leagueSeason.endAt >= now
    ) {
      return;
    }

    const userScoreList =
      await this.placeVisitCoreService.getPlaceVisitUserScoreAllByDatePeriod(
        leagueSeason.startAt,
        leagueSeason.endAt,
      );

    for (const userScore of userScoreList) {
      await this.leagueSeasonCoreService.createLeagueSeasonResult({
        leagueSeasonIdx: leagueSeason.idx,
        userIdx: userScore.userIdx,
        finalScore: userScore.score,
      });
    }

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(
      leagueSeason.idx,
      { finalizedAt: now },
    );
  }
}
