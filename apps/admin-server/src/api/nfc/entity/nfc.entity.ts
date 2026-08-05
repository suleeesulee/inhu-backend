import { NfcModel } from '@libs/core/nfc/model/nfc.model';

export class NfcEntity {
  /**
   * NFC 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 장소 식별자
   *
   * @example 1
   */
  public placeIdx: number;

  /**
   * NFC 밥그릇 점수
   *
   * @example 3
   */
  public score: number;

  /**
   * NFC 토큰 해시
   *
   * @example "hashed_token"
   */
  public tokenHash: string;

  /**
   * NFC 활성화 시간
   */
  public activatedAt: Date | null;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  constructor(data: NfcEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: NfcModel): NfcEntity {
    return new NfcEntity({
      idx: model.idx,
      placeIdx: model.placeIdx,
      score: model.score,
      tokenHash: model.tokenHash,
      activatedAt: model.activatedAt,
      createdAt: model.createdAt,
    });
  }
}
