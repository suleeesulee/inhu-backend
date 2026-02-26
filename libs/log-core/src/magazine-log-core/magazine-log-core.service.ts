import { Injectable } from '@nestjs/common';
import { MagazineLogCoreRepository } from './magazine-log-core.repository';
import { CreateDimMagazineInput } from './inputs/create-dim-magazine.input';
import { CreateDimMagazineLikeInput } from './inputs/create-dim-magazine-like.input';
import { Transactional } from '@nestjs-cls/transactional';
import { CreateDimMainCategoryMappingInput } from './inputs/create-dim-magazine-main-category-mapping.input';
import { CreateDimMoodCategoryMappingInput } from './inputs/create-dim-magazine-mood-category-mapping.input';
import { CreateDimPlaceTypeMagazineMappingInput } from './inputs/create-dim-place-type-magazine-mapping.input';

@Injectable()
export class MagazineLogCoreService {
  constructor(
    private readonly magazineLogCoreRepository: MagazineLogCoreRepository,
  ) {}

  @Transactional()
  public async createDimMagazine(
    input: CreateDimMagazineInput,
    updatedAt: Date,
  ) {
    await this.magazineLogCoreRepository.insertDimMagazine({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimMagazineLike(
    input: CreateDimMagazineLikeInput,
    updatedAt: Date,
  ) {
    await this.magazineLogCoreRepository.insertDimMagazineLike({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimPlaceTypeMagazineMapping(
    input: CreateDimPlaceTypeMagazineMappingInput,
    updatedAt: Date,
  ) {
    await this.magazineLogCoreRepository.insertDimPlaceTypeMagazineMapping({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimMagazineMainCategoryMapping(
    input: CreateDimMainCategoryMappingInput,
    updatedAt: Date,
  ) {
    await this.magazineLogCoreRepository.insertDimMagazineMainCategoryMapping({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimMagazineMoodCategoryMapping(
    input: CreateDimMoodCategoryMappingInput,
    updatedAt: Date,
  ) {
    await this.magazineLogCoreRepository.insertDimMagazineMoodCategoryMapping({
      ...input,
      validFrom: updatedAt,
    });
  }
}
