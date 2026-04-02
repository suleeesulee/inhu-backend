import { Injectable } from '@nestjs/common';
import { MagazineSectionCoreRepository } from './magazine-section-core.repository';
import { MagazineSectionModel } from './model/magazine-section.model';
import { CreateMagazineSectionInput } from './inputs/create-place-section.input';
import { UpdateMagazineSectionInput } from './inputs/update-place-section.input';
import { GetMagazineSectionAllInput } from './inputs/get-place-section-all.input';

@Injectable()
export class MagazineSectionCoreService {
  constructor(
    private readonly placeSectionCoreRepository: MagazineSectionCoreRepository,
  ) {}

  public async getMagazineSectionByIdx(
    idx: number,
  ): Promise<MagazineSectionModel | null> {
    const placeSection =
      await this.placeSectionCoreRepository.selectMagazineSectionByIdx(idx);
    return placeSection && MagazineSectionModel.fromPrisma(placeSection);
  }

  public async getMagazineSectionAll(
    input?: GetMagazineSectionAllInput,
  ): Promise<MagazineSectionModel[]> {
    return (
      await this.placeSectionCoreRepository.selectMagazineSectionAll(input)
    ).map(MagazineSectionModel.fromPrisma);
  }

  public async createMagazineSection(
    input: CreateMagazineSectionInput,
  ): Promise<MagazineSectionModel> {
    return MagazineSectionModel.fromPrisma(
      await this.placeSectionCoreRepository.createMagazineSection(input),
    );
  }

  public async updateMagazineSectionByIdx(
    idx: number,
    input: UpdateMagazineSectionInput,
  ): Promise<void> {
    await this.placeSectionCoreRepository.updateMagazineSectionByIdx(
      idx,
      input,
    );
  }

  public async deleteMagazineSectionByIdx(idx: number): Promise<void> {
    await this.placeSectionCoreRepository.softDeleteMagazineSectionByIdx(idx);
  }
}
