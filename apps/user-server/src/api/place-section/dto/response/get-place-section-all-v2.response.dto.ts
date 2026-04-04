import { PlaceSectionEntity } from '../../entity/place-section.entity';

export class GetPlaceSectionAllV2ResponseDto {
  hasNext: boolean;
  placeSectionEntityList: PlaceSectionEntity[];
}
