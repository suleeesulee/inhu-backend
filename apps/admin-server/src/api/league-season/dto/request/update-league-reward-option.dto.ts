import { PickType } from '@nestjs/swagger';
import { CreateLeagueRewardOptionDto } from './create-league-reward-option.dto';

export class UpdateLeagueRewardOptionDto extends PickType(
  CreateLeagueRewardOptionDto,
  ['rewardIdx', 'targetRank'],
) {}
