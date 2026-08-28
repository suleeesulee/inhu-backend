import { PickType } from '@nestjs/swagger';
import { SelectUserRankingOverview } from './prisma-type/select-user-ranking-overview';
import { UserRankingModel } from './user-ranking.model';

export class UserRankingOverviewModel extends PickType(UserRankingModel, [
  'seasonRank',
  'cumulativeRank',
  'cumulativeScore',
]) {
  constructor(data: UserRankingOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromQuery(
    data: SelectUserRankingOverview,
  ): UserRankingOverviewModel {
    return new UserRankingOverviewModel({
      seasonRank: data.seasonRank,
      cumulativeRank: data.cumulativeRank,
      cumulativeScore: data.cumulativeScore,
    });
  }
}
