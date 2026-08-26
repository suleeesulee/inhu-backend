import { SeasonUserRankingModel } from '@libs/core/user-ranking/model/season-user-ranking.model';
import { PickType } from '@nestjs/swagger';
import { UserRankingEntity } from './user-ranking.entity';

export class SeasonUserRankingEntity extends PickType(UserRankingEntity, [
  'userIdx',
  'nickname',
  'seasonRank',
  'seasonScore',
  'seasonLatestVisitAt',
]) {
  constructor(data: SeasonUserRankingEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: SeasonUserRankingModel,
  ): SeasonUserRankingEntity {
    return new SeasonUserRankingEntity({
      userIdx: model.userIdx,
      nickname: model.nickname,
      seasonRank: model.seasonRank,
      seasonScore: model.seasonScore,
      seasonLatestVisitAt: model.seasonLatestVisitAt,
    });
  }
}
