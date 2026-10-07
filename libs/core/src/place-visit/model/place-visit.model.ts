import { PlaceVisitPlaceModel } from './place-visit-place.model';
import { SelectPlaceVisit } from './prisma-type/select-place-visit';

export class PlaceVisitModel {
  /**
   * PlaceVisit 식별자
   */
  public id: string;

  /**
   * 사용자 식별자
   */
  public userIdx: number;

  /**
   * NFC 식별자
   */
  public nfcIdx: number;

  /**
   * 점수
   */
  public score: number;

  /**
   * 방문 인증 위도
   */
  public latitude: number | null;

  /**
   * 방문 인증 경도
   */
  public longitude: number | null;

  /**
   * 방문 장소 정보
   */
  public place: PlaceVisitPlaceModel;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  constructor(data: PlaceVisitModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(placeVisit: SelectPlaceVisit): PlaceVisitModel {
    return new PlaceVisitModel({
      id: placeVisit.id,
      userIdx: placeVisit.userIdx,
      nfcIdx: placeVisit.nfcIdx,
      score: placeVisit.score,
      latitude: placeVisit.latitude?.toNumber() ?? null,
      longitude: placeVisit.longitude?.toNumber() ?? null,
      place: PlaceVisitPlaceModel.fromPrisma(placeVisit.nfc.place),
      createdAt: placeVisit.createdAt,
    });
  }
}
