import { SeasonUserRankingEntity } from '../../entity/season-user-ranking.entity';

export class GetSeasonRankingAllResponseDto {
  public hasNext: boolean;
  public seasonUserRankingList: SeasonUserRankingEntity[];
}
