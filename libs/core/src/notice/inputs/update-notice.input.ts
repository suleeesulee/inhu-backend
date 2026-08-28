import { PartialType } from '@nestjs/swagger';
import { CreateNoticeInput } from './create-notice.input';

/**
 * @publicApi
 */
export class UpdateNoticeInput extends PartialType(CreateNoticeInput) {}
