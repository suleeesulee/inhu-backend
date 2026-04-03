import { PlaceSectionCoreService } from '@libs/core/place-section/place-section-core.service';
import { Injectable } from '@nestjs/common';
import { PlaceSectionEntity } from './entity/place-section.entity';
import { GetPlaceSectionAllResponseDto } from './dto/response/get-place-section-all.response.dto';
import { GetPlaceSectionAllV2ResponseDto } from './dto/response/get-place-section-all-v2.response.dto';
import { GetPlaceSectionAllV2Dto } from './dto/request/get-place-section-all-v2.dto';

@Injectable()
export class PlaceSectionService {
  constructor(
    private readonly placeSectionCoreService: PlaceSectionCoreService,
  ) {}

  public async getPlaceSectionAll(): Promise<GetPlaceSectionAllResponseDto> {
    return {
      placeSectionEntityList: (
        await this.placeSectionCoreService.getPlaceSectionAll()
      ).map(PlaceSectionEntity.fromModel),
    };
  }

  public async getPlaceSectionAllV2(
    dto: GetPlaceSectionAllV2Dto,
  ): Promise<GetPlaceSectionAllV2ResponseDto> {
    const pageSize = 3;
    const placeSectionModelList =
      await this.placeSectionCoreService.getPlaceSectionAll({
        take: pageSize + 1,
        skip: pageSize * (dto.page - 1),
      });

    const paginatedList = placeSectionModelList.slice(0, pageSize);
    const hasNext = placeSectionModelList.length > pageSize;

    return {
      hasNext,
      placeSectionEntityList: paginatedList.map(PlaceSectionEntity.fromModel),
    };
  }
}
