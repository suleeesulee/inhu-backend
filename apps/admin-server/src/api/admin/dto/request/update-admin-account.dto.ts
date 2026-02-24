import { PickType } from '@nestjs/swagger';
import { CreateAdminAccountDto } from './create-admin-account.dto';

export class UpdateAdminAccountDto extends PickType(CreateAdminAccountDto, [
  'id',
  'pw',
  'nickname',
]) {}
