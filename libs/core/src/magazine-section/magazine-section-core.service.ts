import { Injectable } from '@nestjs/common';
import { MagazineSectionCoreRepository } from './magazine-section-core.repository';
import { MagazineSectionModel } from './model/magazine-section.model';
import { GetMagazineSectionAllInput } from './inputs/get-magazine-section-all.input';
import { CreateMagazineSectionInput } from './inputs/create-magazine-section.input';
import { UpdateMagazineSectionInput } from './inputs/update-magazine-section.input';

@Injectable()
export class MagazineSectionCoreService {
  constructor(
    private readonly magazineSectionCoreRepository: MagazineSectionCoreRepository,
  ) {}

  public async getMagazineSectionByIdx(
    idx: number,
  ): Promise<MagazineSectionModel | null> {
    const magazineSection =
      await this.magazineSectionCoreRepository.selectMagazineSectionByIdx(idx);
    return magazineSection && MagazineSectionModel.fromPrisma(magazineSection);
  }

  public async getMagazineSectionAll(
    input?: GetMagazineSectionAllInput,
  ): Promise<MagazineSectionModel[]> {
    return (
      await this.magazineSectionCoreRepository.selectMagazineSectionAll(input)
    ).map(MagazineSectionModel.fromPrisma);
  }

  public async createMagazineSection(
    input: CreateMagazineSectionInput,
  ): Promise<MagazineSectionModel> {
    return MagazineSectionModel.fromPrisma(
      await this.magazineSectionCoreRepository.createMagazineSection(input),
    );
  }

  public async updateMagazineSectionByIdx(
    idx: number,
    input: UpdateMagazineSectionInput,
  ): Promise<void> {
    await this.magazineSectionCoreRepository.updateMagazineSectionByIdx(
      idx,
      input,
    );
  }

  public async deleteMagazineSectionByIdx(idx: number): Promise<void> {
    await this.magazineSectionCoreRepository.softDeleteMagazineSectionByIdx(
      idx,
    );
  }
}
