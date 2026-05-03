import { PartialType } from '@nestjs/swagger';
import { CreateMealOfferingInput } from './create-meal-offering.input';

export class UpdateMealOfferingInput extends PartialType(
  CreateMealOfferingInput,
) {}
