import { PickType } from '@nestjs/swagger';
import { CreateCafeteriaDto } from './create-cafeteria.dto';

export class UpdateCafeteriaDto extends PickType(CreateCafeteriaDto, [
  'name',
]) {}
