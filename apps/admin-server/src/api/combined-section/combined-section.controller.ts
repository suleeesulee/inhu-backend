import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Controller, Get } from '@nestjs/common';
import { CombinedSectionService } from './combined-section.service';
import {
  GetCombinedSectionAllResponseDto,
  MagazineSectionItem,
  PlaceSectionItem,
} from './response/get-combined-section-all.response.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@Controller('combined-section')
export class CombinedSectionController {
  constructor(
    private readonly combinedSectionService: CombinedSectionService,
  ) {}

  @Get('/all')
  @AdminAuth()
  @ApiExtraModels(PlaceSectionItem, MagazineSectionItem)
  public async getCombinedSectionAll(): Promise<GetCombinedSectionAllResponseDto> {
    return await this.combinedSectionService.getCombinedSectionAll();
  }
}
