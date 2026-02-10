import { PartialType } from '@nestjs/swagger';
import { CreateMenuInput } from './create-menu.input';

/**
 * UpdateMenuInput 클래스
 *
 * @publicApi
 */
export class UpdateMenuInput extends PartialType(CreateMenuInput) {}
