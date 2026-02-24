import { PartialType } from '@nestjs/swagger';
import { CreateAdminAccountInput } from './create-admin-account.input';

export class UpdateAdminAccountInput extends PartialType(
  CreateAdminAccountInput,
) {}
