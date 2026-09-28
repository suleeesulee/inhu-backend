import { PickType } from '@nestjs/swagger';
import { CreatePlaceVisitByNfcDto } from './create-place-visit-by-nfc.dto';

export class PlaceVisitByNfcTestDto extends PickType(CreatePlaceVisitByNfcDto, [
  'picc_data',
  'enc',
  'cmac',
  'latitude',
  'longitude',
]) {}
