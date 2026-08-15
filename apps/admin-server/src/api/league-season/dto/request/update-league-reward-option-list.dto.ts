import { PickType } from '@nestjs/swagger';
import { CreateLeagueSeasonDto } from './create-league-season.dto';

export class UpdateLeagueRewardOptionListDto extends PickType(
  CreateLeagueSeasonDto,
  ['rewardOptionList'] as const,
) {}
