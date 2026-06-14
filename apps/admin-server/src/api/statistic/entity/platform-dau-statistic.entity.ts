export class PlatformDauStatisticEntity {
  /**
   * iOS, Android, Web
   *
   * @example iOS
   */
  platform: string;

  /**
   * 활성 사용자 수
   *
   * @example 12
   */
  value: number;

  constructor(data: PlatformDauStatisticEntity) {
    Object.assign(this, data);
  }

  public static from(data: { platform: string; value: number }) {
    return new PlatformDauStatisticEntity(data);
  }
}
