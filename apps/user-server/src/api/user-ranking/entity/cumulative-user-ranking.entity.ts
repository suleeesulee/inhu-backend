import { CumulativeUserRankingModel } from '@libs/core/user-ranking/model/cumulative-user-ranking.model';
import { PickType } from '@nestjs/swagger';
import { UserRankingEntity } from './user-ranking.entity';

export class CumulativeUserRankingEntity extends PickType(UserRankingEntity, [
  'userIdx',
  'nickname',
  'cumulativeRank',
  'cumulativeScore',
  'cumulativeLatestVisitAt',
]) {
  constructor(data: CumulativeUserRankingEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: CumulativeUserRankingModel,
  ): CumulativeUserRankingEntity {
    return new CumulativeUserRankingEntity({
      userIdx: model.userIdx,
      nickname: model.nickname,
      cumulativeRank: model.cumulativeRank,
      cumulativeScore: model.cumulativeScore,
      cumulativeLatestVisitAt: model.cumulativeLatestVisitAt,
    });
  }
}
