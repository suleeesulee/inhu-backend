import { PickType } from '@nestjs/swagger';
import { CreateManagedUserDto } from './create-managed-user.dto';

export class UpdateManagedUserDto extends PickType(CreateManagedUserDto, [
  'nickname',
  'profileImagePath',
] as const) {}
