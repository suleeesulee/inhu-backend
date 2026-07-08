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
      createdAt: placeVisit.createdAt,
    });
  }
}
