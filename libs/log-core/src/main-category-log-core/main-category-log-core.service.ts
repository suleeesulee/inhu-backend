import { Injectable } from '@nestjs/common';
import { MainCategoryLogCoreRepository } from './main-category-log-core.repository';
import { Transactional } from '@nestjs-cls/transactional';
import { CreateDimMainCategoryInput } from './inputs/create-dim-main-category.input';

@Injectable()
export class MainCategoryLogCoreService {
  constructor(
    private readonly mainCategoryLogCoreRepository: MainCategoryLogCoreRepository,
  ) {}

  @Transactional()
  public async createDimMainCategory(
    input: CreateDimMainCategoryInput,
    updatedAt: Date,
  ) {
    await this.mainCategoryLogCoreRepository.insertDimMainCategory({
      ...input,
      validFrom: updatedAt,
    });
  }
}
