import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class GetPlaceVisitAllDto {
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
   * 장소 식별자
   *
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public place?: number;

  /**
   * 사용자 식별자
   *
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public user?: number;
}
