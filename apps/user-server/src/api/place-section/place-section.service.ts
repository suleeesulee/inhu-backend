import { PlaceSectionCoreService } from '@libs/core/place-section/place-section-core.service';
import { Injectable } from '@nestjs/common';
import { PlaceSectionEntity } from './entity/place-section.entity';
import { GetPlaceSectionAllResponseDto } from './dto/response/get-place-section-all.response.dto';
import { GetPlaceSectionAllV2Dto } from './dto/request/get-place-section-all-v2.dto';
import { MagazineSectionCoreService } from '@libs/core/magazine-section/magazine-section-core.service';
import { MagazineSectionEntity } from '../magazine-section/entity/magazine-section.entity';
import {
  GetPlaceSectionAllV2ResponseDto,
  MagazineSectionItem,
  PlaceSectionItem,
} from './dto/response/get-place-section-all-v2.response.dto';

@Injectable()
export class PlaceSectionService {
  constructor(
    private readonly placeSectionCoreService: PlaceSectionCoreService,
    private readonly magazineSectionCoreService: MagazineSectionCoreService,
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
    const PLACE_PAGE_SIZE = 9;
    const MAGAZINE_PAGE_SIZE = 3;

    const [placeSectionModelList, magazineSectionModelList] = await Promise.all(
      [
        this.placeSectionCoreService.getPlaceSectionAll({
          take: PLACE_PAGE_SIZE + 1,
          skip: PLACE_PAGE_SIZE * (dto.page - 1),
        }),
        this.magazineSectionCoreService.getMagazineSectionAll({
          take: MAGAZINE_PAGE_SIZE + 1,
          skip: MAGAZINE_PAGE_SIZE * (dto.page - 1),
        }),
      ],
    );

    const paginatedPlaceSectionList = placeSectionModelList
      .slice(0, PLACE_PAGE_SIZE)
      .map(PlaceSectionEntity.fromModel);
    const paginatedMagazineSectionList = magazineSectionModelList
      .slice(0, MAGAZINE_PAGE_SIZE)
      .map(MagazineSectionEntity.fromModel);

    const hasNext =
      placeSectionModelList.length > PLACE_PAGE_SIZE ||
      magazineSectionModelList.length > MAGAZINE_PAGE_SIZE;

    const combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[] = [];

    for (let i = 0; i < 4; i++) {
      const places = paginatedPlaceSectionList.slice(i * 3, (i + 1) * 3);
      places.forEach((p) => combinedSectionList.push({ ...p, type: 'PLACE' }));

      const magazine = paginatedMagazineSectionList[i];
      if (magazine) {
        combinedSectionList.push({ ...magazine, type: 'MAGAZINE' });
      }
    }

    return {
      hasNext,
      combinedSectionList: combinedSectionList,
    };
  }
}
