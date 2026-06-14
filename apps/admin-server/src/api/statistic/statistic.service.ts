import { Ga4Service } from '@libs/common/modules/ga4/ga4.service';
import { Injectable } from '@nestjs/common';
import { DauStatisticEntity } from './entity/dau-statistic.entity';
import { PageViewHistoryEntity } from './entity/page-view-history.entity';

@Injectable()
export class StatisticService {
  constructor(private readonly ga4Service: Ga4Service) {}

  public async getDauByMonth() {
    return [...(await this.ga4Service.getDauByMonth()).entries()].map(
      ([date, value]) => DauStatisticEntity.from(date, value),
    );
  }

  public async getPageViewHistory() {
    return (await this.ga4Service.getScreenViewRankingByMonth()).map(
      PageViewHistoryEntity.from,
    );
  }
}
