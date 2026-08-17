import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetRewardAllDto {
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
   * - true: 활성화된 리워드만 조회
   * - false: 비활성화된 리워드만 조회
   * - undefined: 모든 리워드 조회
   *
   * @example true
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  public activated?: boolean;
}
