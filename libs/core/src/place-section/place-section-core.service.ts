import { Injectable } from '@nestjs/common';
import { PlaceSectionCoreRepository } from './place-section-core.repository';
import { PlaceSectionModel } from './model/place-section.model';
import { CreatePlaceSectionInput } from './inputs/create-place-section.input';
import { UpdatePlaceSectionInput } from './inputs/update-place-section.input';

@Injectable()
export class PlaceSectionCoreService {
  constructor(
    private readonly placeSectionCoreRepository: PlaceSectionCoreRepository,
  ) {}

  public async getPlaceSectionByIdx(
    idx: number,
  ): Promise<PlaceSectionModel | null> {
    const placeSection =
      await this.placeSectionCoreRepository.selectPlaceSectionByIdx(idx);
    return placeSection && PlaceSectionModel.fromPrisma(placeSection);
  }

  public async getPlaceSectionAll(): Promise<PlaceSectionModel[]> {
    return (await this.placeSectionCoreRepository.selectPlaceSectionAll()).map(
      PlaceSectionModel.fromPrisma,
    );
  }

  public async createPlaceSection(
    input: CreatePlaceSectionInput,
  ): Promise<PlaceSectionModel> {
    return PlaceSectionModel.fromPrisma(
      await this.placeSectionCoreRepository.createPlaceSection(input),
    );
  }

  public async updatePlaceSectionByIdx(
    idx: number,
    input: UpdatePlaceSectionInput,
  ): Promise<void> {
    await this.placeSectionCoreRepository.updatePlaceSectionByIdx(idx, input);
  }

  public async deletePlaceSectionByIdx(idx: number): Promise<void> {
    await this.placeSectionCoreRepository.softDeletePlaceSectionByIdx(idx);
  }
}
