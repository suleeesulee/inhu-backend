import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetAdminAccountAllDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;
}
