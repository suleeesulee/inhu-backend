import { Injectable } from '@nestjs/common';
import { MenuLogCoreRepository } from './menu-log-core.repository';
import { CreateDimMenuInput } from './inputs/create-dim-menu.input';
import { Transactional } from '@nestjs-cls/transactional';
import { CreateDimMenuReviewInput } from './inputs/create-dim-menu-review.input';

@Injectable()
export class MenuLogCoreService {
  constructor(private readonly menuLogCoreRepository: MenuLogCoreRepository) {}

  @Transactional()
  public async createDimMenu(input: CreateDimMenuInput, updatedAt: Date) {
    await this.menuLogCoreRepository.insertDimMenu({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimMenuReview(
    input: CreateDimMenuReviewInput,
    updatedAt: Date,
  ) {
    await this.menuLogCoreRepository.insertDimMenuReview({
      ...input,
      validFrom: updatedAt,
    });
  }
}
