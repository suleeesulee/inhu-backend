import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class GetLeagueSeasonResultAllDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  public page: number;

  /**
   * 정렬 방향
   *
   * @example "desc"
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'desc' | 'asc' = 'desc';
}
