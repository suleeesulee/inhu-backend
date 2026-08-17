import { PickType } from '@nestjs/swagger';
import { CreateNfcDto } from './create-nfc.dto';

export class UpdateNfcDto extends PickType(CreateNfcDto, ['score', 'uid']) {}
