import { SearchedMagazineOverviewEntity } from '../../entity/searched-magazine-overview.entity';

export class GetAllSearchedMagazineResponseDto {
  searchedMagazineList: SearchedMagazineOverviewEntity[];
  hasNext: boolean;
}
