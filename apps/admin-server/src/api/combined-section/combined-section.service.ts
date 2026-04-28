import { Injectable } from '@nestjs/common';
import { PlaceSectionCoreService } from '@libs/core/place-section/place-section-core.service';
import { MagazineSectionCoreService } from '@libs/core/magazine-section/magazine-section-core.service';
import {
  GetCombinedSectionAllResponseDto,
  MagazineSectionItem,
  PlaceSectionItem,
} from './response/get-combined-section-all.response.dto';
import { PlaceSectionEntity } from '../place-section/entity/place-section.entity';
import { MagazineSectionEntity } from '../magazine-section/entity/magazine-section.entity';

@Injectable()
export class CombinedSectionService {
  constructor(
    private readonly magazineSectionCoreService: MagazineSectionCoreService,
    private readonly placeSectionCoreService: PlaceSectionCoreService,
  ) {}

  public async getCombinedSectionAll(): Promise<GetCombinedSectionAllResponseDto> {
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
        (!magazineModel || placeModel.sortOrder > magazineModel.sortOrder)
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
            return {
              ...PlaceSectionEntity.fromModel(model),
              type: 'PLACE',
            } as PlaceSectionItem;
          } else {
            return {
              ...MagazineSectionEntity.fromModel(model),
              type: 'MAGAZINE',
            } as MagazineSectionItem;
          }
        }),
      );
    return { combinedSectionList };
  }
}
