import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetLeagueSeasonByIdxDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  leagueSeasonIdx?: number;
}
