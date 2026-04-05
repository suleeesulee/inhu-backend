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
import { PlaceService } from '../place/place.service';
import { MagazineService } from '../magazine/magazine.service';
import { GetAllPlaceOverviewDto } from '../place/dto/request/get-all-place-overview.dto';
import { SectionPlaceOverviewEntity } from './entity/section-place-overview.entity';
import { GetAllMagazineDto } from '../magazine/dto/request/get-all-magazine.dto';

@Injectable()
export class PlaceSectionService {
  constructor(
    private readonly placeSectionCoreService: PlaceSectionCoreService,
    private readonly magazineSectionCoreService: MagazineSectionCoreService,
    private readonly placeService: PlaceService,
    private readonly magazineService: MagazineService,
  ) {}

  public async getPlaceSectionAll(): Promise<GetPlaceSectionAllResponseDto> {
    return {
      placeSectionEntityList: (
        await this.placeSectionCoreService.getPlaceSectionAll()
      ).map((model) => PlaceSectionEntity.fromModel(model)),
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

    const paginatedPlaceSectionModels = placeSectionModelList.slice(
      0,
      PLACE_PAGE_SIZE,
    );
    const paginatedMagazineSectionModels = magazineSectionModelList.slice(
      0,
      MAGAZINE_PAGE_SIZE,
    );

    const hasNext =
      placeSectionModelList.length > PLACE_PAGE_SIZE ||
      magazineSectionModelList.length > MAGAZINE_PAGE_SIZE;

    const paginatedPlaceSectionList = await Promise.all(
      paginatedPlaceSectionModels.map(async (model) => {
        const overviewDto: GetAllPlaceOverviewDto = {
          ...model.parameter,
          page: 1,
        };

        const { placeOverviewList } =
          await this.placeService.getPlaceOverviewAll(overviewDto);

        const sectionOverviewList = placeOverviewList.map(
          (place) => new SectionPlaceOverviewEntity(place),
        );

        return PlaceSectionEntity.fromModel(model, sectionOverviewList);
      }),
    );

    const paginatedMagazineSectionList = await Promise.all(
      paginatedMagazineSectionModels.map(async (model) => {
        const magazineDto: GetAllMagazineDto = {
          ...model.parameter,
          page: 1,
        };

        const { magazineList } =
          await this.magazineService.getMagazineAll(magazineDto);

        return MagazineSectionEntity.fromModel(model, magazineList);
      }),
    );

    const combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[] = [];

    for (let i = 0; i < 4; i++) {
      const places = paginatedPlaceSectionList.slice(i * 3, (i + 1) * 3);
      places.forEach((p) =>
        combinedSectionList.push({ ...p, type: 'PLACE' } as PlaceSectionItem),
      );

      const magazine = paginatedMagazineSectionList[i];
      if (magazine) {
        combinedSectionList.push({
          ...magazine,
          type: 'MAGAZINE',
        } as MagazineSectionItem);
      }
    }

    return {
      hasNext,
      combinedSectionList,
    };
  }
}
