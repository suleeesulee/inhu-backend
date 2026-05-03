import { PickType } from '@nestjs/swagger';
import { CreateFoodStationDto } from './create-food-station.dto';

export class UpdateFoodStationDto extends PickType(CreateFoodStationDto, [
  'name',
  'startTime',
  'endTime',
]) {}
