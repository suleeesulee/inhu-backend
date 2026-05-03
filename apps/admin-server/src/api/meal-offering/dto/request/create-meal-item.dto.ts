import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMealItemDto {
  /**
   * 메뉴 이름
   *
   * @example "김치찌개"
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 메뉴 가격
   *
   * - update할 때 undefined인 경우, 해당 메뉴의 가격 정보가 사라진 것으로 간주
   *
   * @example 3000
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  price?: number;
}
