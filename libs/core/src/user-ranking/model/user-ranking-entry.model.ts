import { PickType } from '@nestjs/swagger';
import { SelectUserRankingEntry } from './prisma-type/select-user-ranking-entry';
import { UserRankingModel } from './user-ranking.model';

export class UserRankingEntryModel extends PickType(UserRankingModel, [
  'userIdx',
  'nickname',
]) {
  public rank: number;
  public score: number;

  constructor(data: UserRankingEntryModel) {
    super();
    Object.assign(this, data);
  }

  public static fromQuery(data: SelectUserRankingEntry): UserRankingEntryModel {
    return new UserRankingEntryModel({
      userIdx: data.userIdx,
      nickname: data.nickname,
      rank: data.rank,
      score: data.score,
    });
  }
}
