import { CumulativeUserRankingEntity } from '../../entity/cumulative-user-ranking.entity';

export class GetCumulativeRankingAllResponseDto {
  public hasNext: boolean;
  public cumulativeUserRankingList: CumulativeUserRankingEntity[];
}
