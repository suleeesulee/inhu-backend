import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsKoreanTime } from '@libs/common/decorator/is-korean-time.decorator';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateMealItemDto } from './create-meal-item.dto';

export class CreateMealOfferingDto {
  @IsString()
  @IsKoreanTime()
  public startTime: string;

  @IsString()
  @IsKoreanTime()
  public endTime: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public kcal?: number;

  @IsString()
  @IsKoreanDate()
  public servedDate: string;

  @ValidateNested({ each: true })
  @Type(() => CreateMealItemDto)
  public mealItemList: CreateMealItemDto[];
}
