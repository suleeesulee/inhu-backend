import { UserRankingEntryEntity } from '../../entity/user-ranking-entry.entity';

export class GetSeasonRankingAllResponseDto {
  public hasNext: boolean;
  public userRankingEntryList: UserRankingEntryEntity[];
}
