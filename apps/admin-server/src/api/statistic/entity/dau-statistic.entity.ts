import { PlatformDauStatisticEntity } from './platform-dau-statistic.entity';

export class DauStatisticEntity {
  /**
   * @example 20261010
   */
  date: string;

  values: PlatformDauStatisticEntity[];

  constructor(data: DauStatisticEntity) {
    Object.assign(this, data);
  }

  public static from(
    date: string,
    values: { platform: string; value: number }[],
  ) {
    return new DauStatisticEntity({
      date,
      values: values.map(PlatformDauStatisticEntity.from),
    });
  }
}
