import { PickType } from '@nestjs/swagger';
import { SelectSeasonUserRanking } from './prisma-type/select-season-user-ranking';
import { UserRankingModel } from './user-ranking.model';

export class SeasonUserRankingModel extends PickType(UserRankingModel, [
  'userIdx',
  'nickname',
  'seasonRank',
  'seasonScore',
]) {
  constructor(data: SeasonUserRankingModel) {
    super();
    Object.assign(this, data);
  }

  public static fromQuery(
    data: SelectSeasonUserRanking,
  ): SeasonUserRankingModel {
    return new SeasonUserRankingModel({
      userIdx: data.userIdx,
      nickname: data.nickname,
      seasonRank: data.seasonRank,
      seasonScore: data.seasonScore,
    });
  }
}
