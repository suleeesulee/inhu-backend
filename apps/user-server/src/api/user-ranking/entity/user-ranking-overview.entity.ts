import { UserRankingOverviewModel } from '@libs/core/user-ranking/model/user-ranking-overview.model';
import { PickType } from '@nestjs/swagger';
import { UserRankingEntity } from './user-ranking.entity';

export class UserRankingOverviewEntity extends PickType(UserRankingEntity, [
  'seasonRank',
  'cumulativeRank',
  'cumulativeScore',
  'seasonRankingParticipantCount',
  'cumulativeRankingParticipantCount',
]) {
  constructor(data: UserRankingOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: UserRankingOverviewModel,
    seasonRankingParticipantCount: number,
    cumulativeRankingParticipantCount: number,
  ): UserRankingOverviewEntity {
    return new UserRankingOverviewEntity({
      seasonRank: model.seasonRank,
      cumulativeRank: model.cumulativeRank,
      cumulativeScore: model.cumulativeScore,
      seasonRankingParticipantCount,
      cumulativeRankingParticipantCount,
    });
  }
}
