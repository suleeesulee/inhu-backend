export class VerifyNfcResponseDto {
  /**
   * 검증 성공 여부
   *
   * @example true
   */
  valid: boolean;

  /**
   * 복호화된 NFC UID
   *
   * @example "04DE5F1EACC040"
   */
  uid: string;

  /**
   * NFC 읽기 카운터
   *
   * @example 61
   */
  readCounter: number;
}
