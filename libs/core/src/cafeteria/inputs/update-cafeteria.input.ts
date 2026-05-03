import { PartialType } from '@nestjs/swagger';
import { CreateCafeteriaInput } from './create-cafeteria.input';

export class UpdateCafeteriaInput extends PartialType(CreateCafeteriaInput) {}
