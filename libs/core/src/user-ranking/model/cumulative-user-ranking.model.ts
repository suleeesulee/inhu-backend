import { PickType } from '@nestjs/swagger';
import { SelectCumulativeUserRanking } from './prisma-type/select-cumulative-user-ranking';
import { UserRankingModel } from './user-ranking.model';

export class CumulativeUserRankingModel extends PickType(UserRankingModel, [
  'userIdx',
  'nickname',
  'cumulativeRank',
  'cumulativeScore',
]) {
  constructor(data: CumulativeUserRankingModel) {
    super();
    Object.assign(this, data);
  }

  public static fromQuery(
    data: SelectCumulativeUserRanking,
  ): CumulativeUserRankingModel {
    return new CumulativeUserRankingModel({
      userIdx: data.userIdx,
      nickname: data.nickname,
      cumulativeRank: data.cumulativeRank,
      cumulativeScore: data.cumulativeScore,
    });
  }
}
