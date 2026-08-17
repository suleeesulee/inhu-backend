import { PickType } from '@nestjs/swagger';
import { CreateRewardDto } from './create-reward.dto';

export class UpdateRewardDto extends PickType(CreateRewardDto, [
  'name',
  'imagePath',
]) {}
