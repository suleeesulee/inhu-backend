import { PickType } from '@nestjs/swagger';
import { CreateMealOfferingDto } from './create-meal-offering.dto';

export class UpdateMealOfferingDto extends PickType(CreateMealOfferingDto, [
  'startTime',
  'endTime',
  'kcal',
  'mealItemList',
]) {}
