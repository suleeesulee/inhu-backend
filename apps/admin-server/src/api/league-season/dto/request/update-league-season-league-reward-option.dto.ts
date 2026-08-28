import { PickType } from '@nestjs/swagger';
import { CreateLeagueSeasonLeagueRewardOptionDto } from './create-league-season-league-reward-option.dto';

export class UpdateLeagueSeasonLeagueRewardOptionDto extends PickType(
  CreateLeagueSeasonLeagueRewardOptionDto,
  ['rewardOptionList'],
) {}
