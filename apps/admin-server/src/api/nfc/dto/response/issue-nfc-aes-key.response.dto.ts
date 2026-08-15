export class IssueNfcAesKeyResponseDto {
  /**
   * NFC UID
   *
   * @example "04DE5F1EACC040"
   */
  uid: string;

  /**
   * 태그에 설정할 AES-128 키
   *
   * @example "00112233445566778899AABBCCDDEEFF"
   */
  nfcAesKey: string;
}
