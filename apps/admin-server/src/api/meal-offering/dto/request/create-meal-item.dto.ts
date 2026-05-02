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
   * @example 3000
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  price?: number;
}
