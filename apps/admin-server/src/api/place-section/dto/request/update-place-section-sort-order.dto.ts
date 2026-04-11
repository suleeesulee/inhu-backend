import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdatePlaceSectionSortOrderDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  public sortOrder: number;
}
