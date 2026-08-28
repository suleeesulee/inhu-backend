import { PlaceVisitEntity } from '../../entity/place-visit.entity';

export class GetPlaceVisitAllResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  public hasNext: boolean;

  /**
   * 방문 인증 내역 리스트
   */
  public placeVisitList: PlaceVisitEntity[];
}
