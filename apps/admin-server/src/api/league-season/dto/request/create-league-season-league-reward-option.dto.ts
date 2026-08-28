import { PickType } from '@nestjs/swagger';
import { CreateLeagueSeasonDto } from './create-league-season.dto';

export class CreateLeagueSeasonLeagueRewardOptionDto extends PickType(
  CreateLeagueSeasonDto,
  ['rewardOptionList'],
) {}
