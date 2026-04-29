import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceSectionCoreService } from '@libs/core/place-section/place-section-core.service';
import { MagazineSectionCoreService } from '@libs/core/magazine-section/magazine-section-core.service';
import {
  GetCombinedSectionAllResponseDto,
  MagazineSectionItem,
  PlaceSectionItem,
} from './dto/response/get-combined-section-all.response.dto';
import { PlaceSectionEntity } from './entity/place-section.entity';
import { MagazineSectionEntity } from './entity/magazine-section.entity';
import { CreateMagazineSectionDto } from './dto/request/create-magazine-section.dto';
import { UpdateMagazineSectionDto } from './dto/request/update-magazine-section.dto';
import { Locker } from '@libs/common/decorator/locker.decorator';
import { Transactional } from '@nestjs-cls/transactional';
import { UpdateMagazineSectionSortOrderDto } from './dto/request/update-magazine-section-sort-order.dto';
import { CreatePlaceSectionDto } from './dto/request/create-place-section.dto';
import { UpdatePlaceSectionDto } from './dto/request/update-place-section.dto';
import { UpdatePlaceSectionSortOrderDto } from './dto/request/update-place-section-sort-order.dto';

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

  // ------------------- Admin API for Magazine Section ------------------ -

  @Locker({
    key: (idx: number) => `section:${idx}:sort-order`,
  })
  @Transactional()
  public async createMagazineSection(
    dto: CreateMagazineSectionDto,
  ): Promise<MagazineSectionEntity> {
    const magazineSectionCount =
      await this.magazineSectionCoreService.getMagazineSectionCount();
    const placeSectionCount =
      await this.placeSectionCoreService.getPlaceSectionCount();

    return await this.magazineSectionCoreService
      .createMagazineSection({
        ...dto,
        sortOrder: magazineSectionCount + placeSectionCount + 1,
      })
      .then(MagazineSectionEntity.fromModel);
  }

  @Locker({
    key: (idx: number) => `section:${idx}:sort-order`,
  })
  @Transactional()
  public async updateMagazineSection(
    idx: number,
    dto: UpdateMagazineSectionDto,
  ): Promise<void> {
    const magazineSectionModel =
      await this.magazineSectionCoreService.getMagazineSectionByIdx(idx);
    if (!magazineSectionModel) {
      throw new NotFoundException(`MagazineSection with idx ${idx} not found`);
    }

    await this.magazineSectionCoreService.updateMagazineSectionByIdx(idx, dto);
  }

  @Locker({
    key: (idx: number) => `section:${idx}:sort-order`,
  })
  @Transactional()
  public async updateMagazineSectionSortOrder(
    idx: number,
    dto: UpdateMagazineSectionSortOrderDto,
  ): Promise<void> {
    const magazineSectionModel =
      await this.magazineSectionCoreService.getMagazineSectionByIdx(idx);

    if (!magazineSectionModel) {
      throw new NotFoundException(`MagazineSection with idx ${idx} not found`);
    }

    if (dto.sortOrder && dto.sortOrder !== magazineSectionModel.sortOrder) {
      const oldOrder = magazineSectionModel.sortOrder;
      const newOrder = dto.sortOrder;

      await this.placeSectionCoreService.incrementPlaceSectionSortOrder(
        oldOrder,
        newOrder,
      );
      await this.magazineSectionCoreService.incrementMagazineSectionSortOrder(
        oldOrder,
        newOrder,
      );
    }

    await this.magazineSectionCoreService.updateMagazineSectionByIdx(idx, dto);
  }

  @Locker({
    key: (idx: number) => `section:${idx}:sort-order`,
  })
  @Transactional()
  public async deleteMagazineSection(idx: number): Promise<void> {
    const magazineSectionModel =
      await this.magazineSectionCoreService.getMagazineSectionByIdx(idx);
    if (!magazineSectionModel) {
      throw new NotFoundException(`MagazineSection with idx ${idx} not found`);
    }

    await this.placeSectionCoreService.incrementPlaceSectionSortOrder(
      magazineSectionModel.sortOrder,
    );
    await this.magazineSectionCoreService.incrementMagazineSectionSortOrder(
      magazineSectionModel.sortOrder,
    );

    await this.magazineSectionCoreService.deleteMagazineSectionByIdx(idx);
  }

  // ------------------- Admin API for Place Section ------------------ -

  @Locker({
    key: (idx: number) => `section:${idx}:sort-order`,
  })
  @Transactional()
  public async createPlaceSection(
    dto: CreatePlaceSectionDto,
  ): Promise<PlaceSectionEntity> {
    const magazineSectionCount =
      await this.magazineSectionCoreService.getMagazineSectionCount();
    const placeSectionCount =
      await this.placeSectionCoreService.getPlaceSectionCount();

    return await this.placeSectionCoreService
      .createPlaceSection({
        ...dto,
        sortOrder: magazineSectionCount + placeSectionCount + 1,
      })
      .then(PlaceSectionEntity.fromModel);
  }

  @Locker({
    key: (idx: number) => `section:${idx}:sort-order`,
  })
  @Transactional()
  public async updatePlaceSection(
    idx: number,
    dto: UpdatePlaceSectionDto,
  ): Promise<void> {
    const placeSectionModel =
      await this.placeSectionCoreService.getPlaceSectionByIdx(idx);
    if (!placeSectionModel) {
      throw new NotFoundException(`PlaceSection with idx ${idx} not found`);
    }

    await this.placeSectionCoreService.updatePlaceSectionByIdx(idx, dto);
  }

  @Locker({
    key: (idx: number) => `section:${idx}:sort-order`,
  })
  @Transactional()
  public async updatePlaceSectionSortOrder(
    idx: number,
    dto: UpdatePlaceSectionSortOrderDto,
  ): Promise<void> {
    const placeSectionModel =
      await this.placeSectionCoreService.getPlaceSectionByIdx(idx);

    if (!placeSectionModel) {
      throw new NotFoundException(`PlaceSection with idx ${idx} not found`);
    }

    if (dto.sortOrder && dto.sortOrder !== placeSectionModel.sortOrder) {
      const oldOrder = placeSectionModel.sortOrder;
      const newOrder = dto.sortOrder;

      await this.placeSectionCoreService.incrementPlaceSectionSortOrder(
        oldOrder,
        newOrder,
      );
      await this.magazineSectionCoreService.incrementMagazineSectionSortOrder(
        oldOrder,
        newOrder,
      );
    }

    await this.placeSectionCoreService.updatePlaceSectionByIdx(idx, dto);
  }

  @Locker({
    key: (idx: number) => `section:${idx}:sort-order`,
  })
  @Transactional()
  public async deletePlaceSection(idx: number): Promise<void> {
    const placeSectionModel =
      await this.placeSectionCoreService.getPlaceSectionByIdx(idx);
    if (!placeSectionModel) {
      throw new NotFoundException(`PlaceSection with idx ${idx} not found`);
    }

    await this.placeSectionCoreService.incrementPlaceSectionSortOrder(
      placeSectionModel.sortOrder,
    );
    await this.magazineSectionCoreService.incrementMagazineSectionSortOrder(
      placeSectionModel.sortOrder,
    );

    await this.placeSectionCoreService.deletePlaceSectionByIdx(idx);
  }
}
