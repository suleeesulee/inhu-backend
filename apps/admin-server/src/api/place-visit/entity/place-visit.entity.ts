import { UserEntity } from '@admin/api/user/entity/user.entity';
import { PlaceVisitModel } from '@libs/core/place-visit/model/place-visit.model';
import { UserModel } from '@libs/core/user/model/user.model';
import { PlaceVisitPlaceEntity } from './place-visit-place.entity';

export class PlaceVisitEntity {
  /**
   * PlaceVisit 식별자
   *
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  public id: string;

  /**
   * 사용자 정보
   */
  public user: UserEntity;

  /**
   * NFC 식별자
   *
   * @example 1
   */
  public nfcIdx: number;

  /**
   * 점수
   *
   * @example 3
   */
  public score: number;

  /**
   * 방문 인증 위도
   *
   * @example 37.4508371
   */
  public latitude: number;

  /**
   * 방문 인증 경도
   *
   * @example 126.6531324
   */
  public longitude: number;

  /**
   * 방문 장소 정보
   */
  public place: PlaceVisitPlaceEntity;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  constructor(data: PlaceVisitEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceVisitModel,
    user: UserModel,
  ): PlaceVisitEntity {
    return new PlaceVisitEntity({
      id: model.id,
      user: UserEntity.fromModel(user),
      nfcIdx: model.nfcIdx,
      score: model.score,
      latitude: model.latitude,
      longitude: model.longitude,
      place: PlaceVisitPlaceEntity.fromModel(model.place),
      createdAt: model.createdAt,
    });
  }
}
