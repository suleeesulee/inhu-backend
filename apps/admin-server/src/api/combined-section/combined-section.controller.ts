import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Controller, Get } from '@nestjs/common';
import { CombinedSectionService } from './combined-section.service';
import {
  GetCombinedSectionAllResponseDto,
  MagazineSectionItem,
  PlaceSectionItem,
} from './response/get-combined-section-all.response.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

@Controller('section')
@ApiTags('Section')
export class CombinedSectionController {
  constructor(
    private readonly combinedSectionService: CombinedSectionService,
  ) {}

  /**
   * magazine section과 place section을 모두 조회하는 API
   */
  @Get('/all')
  @AdminAuth()
  @ApiExtraModels(PlaceSectionItem, MagazineSectionItem)
  public async getCombinedSectionAll(): Promise<GetCombinedSectionAllResponseDto> {
    return await this.combinedSectionService.getCombinedSectionAll();
  }
}
