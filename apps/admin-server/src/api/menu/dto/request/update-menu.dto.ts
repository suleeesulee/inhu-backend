import { PickType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PickType(CreateMenuDto, [
  'name',
  'content',
  'price',
  'imagePath',
  'isFlexible',
]) {}
