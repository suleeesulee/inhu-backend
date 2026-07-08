import { PartialType } from '@nestjs/swagger';
import { CreateRewardInput } from './create-reward.input';

/**
 * UpdateRewardInput 클래스
 *
 * @publicApi
 */
export class UpdateRewardInput extends PartialType(CreateRewardInput) {}
