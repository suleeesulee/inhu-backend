import { Controller, Get } from '@nestjs/common';
import { PlaceSectionService } from './place-section.service';
import { GetPlaceSectionAllResponseDto } from './dto/response/get-place-section-all.response.dto';

@Controller('place-section')
export class PlaceSectionController {
  constructor(private readonly placeSectionService: PlaceSectionService) {}

  @Get('/all')
  public async getPlaceSectionAll(): Promise<GetPlaceSectionAllResponseDto> {
    return await this.placeSectionService.getPlaceSectionAll();
  }
}
