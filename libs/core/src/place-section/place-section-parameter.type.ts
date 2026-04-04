import { OmitType } from '@nestjs/swagger';
import { GetAllPlaceOverviewDto } from '@user/api/place/dto/request/get-all-place-overview.dto';

export class PlaceSectionParameter extends OmitType(GetAllPlaceOverviewDto, [
  'page',
]) {}
