import { MagazineSectionCoreService } from '@libs/core/magazine-section/magazine-section-core.service';
import { Injectable } from '@nestjs/common';
import { MagazineSectionEntity } from './entity/magazine-section.entity';
import { GetMagazineSectionAllResponseDto } from './dto/response/get-magazine-section-all.response.dto';
import { GetMagazineSectionAllDto } from './dto/request/get-magazine-section-all.dto';

@Injectable()
export class MagazineSectionService {
  constructor(
    private readonly magazineSectionCoreService: MagazineSectionCoreService,
  ) {}

  public async getMagazineSectionAll(
    dto: GetMagazineSectionAllDto,
  ): Promise<GetMagazineSectionAllResponseDto> {
    const pageSize = 3;
    const magazineSectionModelList =
      await this.magazineSectionCoreService.getMagazineSectionAll({
        take: pageSize + 1,
        skip: pageSize * (dto.page - 1),
      });

    const paginatedList = magazineSectionModelList.slice(0, pageSize);
    const hasNext = magazineSectionModelList.length > pageSize;

    return {
      hasNext,
      magazineSectionEntityList: paginatedList.map(
        MagazineSectionEntity.fromModel,
      ),
    };
  }
}
