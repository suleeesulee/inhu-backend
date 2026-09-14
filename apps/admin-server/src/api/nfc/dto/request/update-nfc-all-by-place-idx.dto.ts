import { PartialType, PickType } from '@nestjs/swagger';
import { CreateNfcDto } from './create-nfc.dto';

export class UpdateNfcAllByPlaceIdxDto extends PartialType(
  PickType(CreateNfcDto, ['score', 'cooldown']),
) {}
