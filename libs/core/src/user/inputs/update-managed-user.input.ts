import { PartialType, PickType } from '@nestjs/swagger';
import { CreateManagedUserInput } from './create-managed-user.input';

export class UpdateManagedUserInput extends PartialType(
  PickType(CreateManagedUserInput, ['nickname', 'profileImagePath']),
) {}
