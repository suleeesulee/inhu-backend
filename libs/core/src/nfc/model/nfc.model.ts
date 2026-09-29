import { SelectNfc } from './prisma-type/select-nfc';
import { NfcPlaceModel } from './nfc-place.model';

export class NfcModel {
  /**
   * NFC 식별자
   */
  public idx: number;

  /**
   * 장소 식별자
   */
  public placeIdx: number;

  /**
   * NFC 밥그릇 점수
   */
  public score: number;

  /**
   * NFC UID
   *
   * ! 관리자 페이지에서만 반환하고 user 페이지에서는 반환하지 않음
   */
  public uid: string;

  /**
   * NFC 쿨다운 시간
   */
  public cooldown: number | null;

  /**
   * NFC 활성화 시간
   */
  public activatedAt: Date | null;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  /**
   * NFC가 설치된 장소
   */
  public place: NfcPlaceModel;

  constructor(data: NfcModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(nfc: SelectNfc): NfcModel {
    return new NfcModel({
      idx: nfc.idx,
      placeIdx: nfc.placeIdx,
      score: nfc.score,
      uid: nfc.uid,
      cooldown: nfc.cooldown,
      activatedAt: nfc.activatedAt,
      createdAt: nfc.createdAt,
      place: NfcPlaceModel.fromPrisma(nfc.place),
    });
  }
}
