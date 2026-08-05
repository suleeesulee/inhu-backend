import { PickType } from '@nestjs/swagger';
import { CreateLeagueSeasonDto } from './create-league-season.dto';

export class UpdateLeagueSeasonDto extends PickType(CreateLeagueSeasonDto, [
  'name',
  'startAt',
  'endAt',
]) {}
