import { Controller, Get, Query } from '@nestjs/common';
import { MagazineSectionService } from './magazine-section.service';
import { GetMagazineSectionAllResponseDto } from './dto/response/get-magazine-section-all.response.dto';
import { GetMagazineSectionAllDto } from './dto/request/get-magazine-section-all.dto';

@Controller()
export class MagazineSectionController {
  constructor(
    private readonly magazineSectionService: MagazineSectionService,
  ) {}

  @Get('/magazine-section/all')
  public async getMagazineSectionAll(
    @Query() dto: GetMagazineSectionAllDto,
  ): Promise<GetMagazineSectionAllResponseDto> {
    return await this.magazineSectionService.getMagazineSectionAll(dto);
  }
}
