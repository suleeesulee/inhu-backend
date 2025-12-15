import { SearchedPlaceOverviewEntity } from '../../entity/searched-place-overview.entity';

export class GetAllSearchedPlaceOverviewResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 장소 목록 data
   */
  searchedPlaceOverviewList: SearchedPlaceOverviewEntity[];
}
