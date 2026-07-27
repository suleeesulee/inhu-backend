import { PartialType } from '@nestjs/swagger';
import { CreateFoodStationInput } from './create-food-station.input';

export class UpdateFoodStationInput extends PartialType(
  CreateFoodStationInput,
) {}
