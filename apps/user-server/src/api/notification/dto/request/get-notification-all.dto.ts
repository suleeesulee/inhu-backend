import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetNotificationAllDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page: number;
}
