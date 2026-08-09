import { UserRankingEntryEntity } from '../../entity/user-ranking-entry.entity';

export class GetCumulativeRankingAllResponseDto {
  public hasNext: boolean;
  public userRankingEntryList: UserRankingEntryEntity[];
}
