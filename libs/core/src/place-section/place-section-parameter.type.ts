import { OmitType } from '@nestjs/swagger';
import { GetAllPlaceOverviewV2Dto } from '@user/api/place/dto/request/get-all-place-overview-v2.dto';

export class PlaceSectionParameter extends OmitType(GetAllPlaceOverviewV2Dto, [
  'page',
]) {}
