import { PlaceSectionCoreService } from '@libs/core/place-section/place-section-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceSectionEntity } from './entity/place-section.entity';
import { GetPlaceSectionAllResponseDto } from './dto/response/get-place-section-all.response.dto';
import { CreatePlaceSectionDto } from './dto/request/create-place-section.dto';
import { UpdatePlaceSectionDto } from './dto/request/update-place-section.dto';

@Injectable()
export class PlaceSectionService {
  constructor(
    private readonly placeSectionCoreService: PlaceSectionCoreService,
  ) {}

  public async getPlaceSectionAll(): Promise<GetPlaceSectionAllResponseDto> {
    return {
      placeSectionEntityList: (
        await this.placeSectionCoreService.getPlaceSectionAll()
      ).map((placeSection) => PlaceSectionEntity.fromModel(placeSection)),
    };
  }

  public async createPlaceSection(
    dto: CreatePlaceSectionDto,
  ): Promise<PlaceSectionEntity> {
    return await this.placeSectionCoreService
      .createPlaceSection(dto)
      .then(PlaceSectionEntity.fromModel);
  }

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

  public async deletePlaceSection(idx: number): Promise<void> {
    const placeSectionModel =
      await this.placeSectionCoreService.getPlaceSectionByIdx(idx);
    if (!placeSectionModel) {
      throw new NotFoundException(`PlaceSection with idx ${idx} not found`);
    }

    await this.placeSectionCoreService.deletePlaceSectionByIdx(idx);
  }
}
