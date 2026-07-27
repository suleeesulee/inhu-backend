import { Controller, Get, Query } from '@nestjs/common';
import { PlaceSectionService } from './place-section.service';
import {
  GetPlaceSectionAllV2ResponseDto,
  MagazineSectionItem,
  PlaceSectionItem,
} from './dto/response/get-place-section-all-v2.response.dto';
import { GetPlaceSectionAllV2Dto } from './dto/request/get-place-section-all-v2.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@Controller()
export class PlaceSectionV2Controller {
  constructor(private readonly placeSectionService: PlaceSectionService) {}

  @Get('/v2/place-section/all')
  @ApiExtraModels(PlaceSectionItem, MagazineSectionItem)
  public async getPlaceSectionAllV2(
    @Query() dto: GetPlaceSectionAllV2Dto,
  ): Promise<GetPlaceSectionAllV2ResponseDto> {
    return await this.placeSectionService.getPlaceSectionAllV2(dto);
  }
}
