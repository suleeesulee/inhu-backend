import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class GetNfcAllDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page: number;

  /**
   * 정렬 방향
   *
   * @example 'desc'
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public order?: 'asc' | 'desc';

  /**
   * 활성화 여부
   *
   * @example true
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  public activated?: boolean;

  /**
   * 장소 식별자
   *
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public place?: number;
}
