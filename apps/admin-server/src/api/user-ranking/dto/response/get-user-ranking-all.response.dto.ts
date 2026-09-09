import { UserRankingOverviewEntity } from '../../entity/user-ranking-overview.entity';

export class GetUserRankingAllResponseDto {
  public count: number;
  public userRankingList: UserRankingOverviewEntity[];
}
