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
import { SectionPlaceOverviewEntity } from './entity/section-place-overview.entity';
import { GetAllMagazineDto } from '../magazine/dto/request/get-all-magazine.dto';
import { GetAllPlaceOverviewV2Dto } from '../place/dto/request/get-all-place-overview-v2.dto';

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
    const [placeSectionModelList, magazineSectionModelList] = await Promise.all(
      [
        this.placeSectionCoreService.getPlaceSectionAll(),
        this.magazineSectionCoreService.getMagazineSectionAll(),
      ],
    );

    const mergedModelList = [];
    let pIndex = 0;
    let mIndex = 0;

    while (
      pIndex < placeSectionModelList.length ||
      mIndex < magazineSectionModelList.length
    ) {
      const placeModel = placeSectionModelList[pIndex];
      const magazineModel = magazineSectionModelList[mIndex];

      if (
        placeModel &&
        (!magazineModel || placeModel.sortOrder < magazineModel.sortOrder)
      ) {
        mergedModelList.push({ type: 'PLACE' as const, model: placeModel });
        pIndex++;
      } else {
        mergedModelList.push({
          type: 'MAGAZINE' as const,
          model: magazineModel,
        });
        mIndex++;
      }
    }

    const combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
      await Promise.all(
        mergedModelList.map(async ({ type, model }) => {
          if (type === 'PLACE') {
            const overviewDto: GetAllPlaceOverviewV2Dto = {
              ...model.parameter,
              page: 1,
            };

            const { placeOverviewList } =
              await this.placeService.getPlaceOverviewAllV2(overviewDto);
            const sectionOverviewList = placeOverviewList.map(
              (place) => new SectionPlaceOverviewEntity(place),
            );

            return {
              ...PlaceSectionEntity.fromModel(model, sectionOverviewList),
              type: 'PLACE',
            } as PlaceSectionItem;
          } else {
            const magazineDto: GetAllMagazineDto = {
              ...model.parameter,
              page: 1,
            };

            const { magazineList } =
              await this.magazineService.getMagazineAll(magazineDto);

            return {
              ...MagazineSectionEntity.fromModel(model, magazineList),
              type: 'MAGAZINE',
            } as MagazineSectionItem;
          }
        }),
      );

    return {
      hasNext: false,
      combinedSectionList,
    };
  }
}
