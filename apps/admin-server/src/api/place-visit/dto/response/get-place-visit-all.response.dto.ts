import { PlaceVisitEntity } from '../../entity/place-visit.entity';

export class GetPlaceVisitAllResponseDto {
  public count: number;
  public placeVisitList: PlaceVisitEntity[];
}
