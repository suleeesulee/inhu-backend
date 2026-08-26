import { UserRankingEntity } from '../../entity/user-ranking.entity';

export class GetUserRankingAllResponseDto {
  public count: number;
  public userRankingList: UserRankingEntity[];
}
