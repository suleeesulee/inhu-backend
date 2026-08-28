import { PartialType } from '@nestjs/swagger';
import { CreateUserRewardInput } from './create-user-reward.input';

export class UpdateUserRewardInput extends PartialType(CreateUserRewardInput) {}
