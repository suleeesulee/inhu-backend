import { PartialType } from '@nestjs/swagger';
import { CreateNfcInput } from './create-nfc.input';

/**
 * UpdateNfcInput 클래스
 *
 * @publicApi
 */
export class UpdateNfcInput extends PartialType(CreateNfcInput) {}
