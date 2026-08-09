import { UserRankingEntryModel } from '@libs/core/user-ranking/model/user-ranking-entry.model';

export class UserRankingEntryEntity {
  public userIdx: number;
  public nickname: string;
  public rank: number;
  public score: number;

  constructor(data: UserRankingEntryEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: UserRankingEntryModel,
  ): UserRankingEntryEntity {
    return new UserRankingEntryEntity({
      userIdx: model.userIdx,
      nickname: model.nickname,
      rank: model.rank,
      score: model.score,
    });
  }
}
