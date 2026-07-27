import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlaceCronService {
  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly dateUtilService: DateUtilService,
    private readonly logger: Logger,
    private readonly discordWebhookService: DiscordWebhookService,
  ) {}

  /**
   * 격주 휴무일 장소에 대해 14일 뒤 다음 휴뮤일을 추가함
   *
   * @author 강정연
   */
  public async AddNextBiWeeklyClosedDay(): Promise<void> {
    const now = this.dateUtilService.getNow();
    const kstStr = this.dateUtilService.transformKoreanDate(now);

    const result =
      await this.placeCoreService.createAllBiWeeklyClosedDay(kstStr);

    if (result.errorList.length > 0) {
      const failLogDetails = result.errorList
        .map((e) => `  - Place Idx: ${e.placeIdx}, Reason: ${e.errorMessage}`)
        .join('\n');

      const errorMessage = `
--- 🚨 Bi-Weekly ClosedDay 배치 실패 요약 ---
  - 성공: ${result.successCount}건
  - 실패: ${result.failureCount}건
---------------------------------------------`;

      this.discordWebhookService.sendErrorMessage(
        '배치 작업 실패 알림',
        errorMessage,
        new Error(failLogDetails),
        DiscordWebhookContext.BATCH_SERVER,
      );
    } else {
      this.logger.log(
        `✅ Bi-Weekly ClosedDay 배치 완료 (성공 ${result.successCount}건)`,
      );
    }
  }
}
