import { Type } from 'class-transformer';
import { IsInt, Min, ValidateIf } from 'class-validator';

export class SetPlacePriorityDto {
  /**
   * 장소 우선순위
   *
   * @example 1
   */
  @Type(() => Number)
  @ValidateIf((object, value) => value !== null)
  @IsInt()
  @Min(0)
  priority: number | null;
}
