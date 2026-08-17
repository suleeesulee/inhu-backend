import { PartialType } from '@nestjs/swagger';
import { CreateLeagueSeasonInput } from './create-league-season.input';

export class UpdateLeagueSeasonInput extends PartialType(
  CreateLeagueSeasonInput,
) {
  public finalizedAt?: Date | null;
}
