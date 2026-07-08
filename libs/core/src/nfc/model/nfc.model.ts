import { SelectNfc } from './prisma-type/select-nfc';

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
   * NFC 토큰 해시
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

  constructor(data: NfcModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(nfc: SelectNfc): NfcModel {
    return new NfcModel({
      idx: nfc.idx,
      placeIdx: nfc.placeIdx,
      score: nfc.score,
      tokenHash: nfc.tokenHash,
      activatedAt: nfc.activatedAt,
      createdAt: nfc.createdAt,
    });
  }
}
