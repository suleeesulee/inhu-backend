import { OmitType } from '@nestjs/swagger';
import { GetPlaceOverviewInput } from './get-place-overview.input';

export class GetRouletteItemInput extends OmitType(GetPlaceOverviewInput, [
  'take',
  'skip',
  'orderBy',
  'order',
  'bookmarkUserIdx',
  'searchKeyword',
] as const) {}
