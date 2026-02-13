import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { MoodCategoryLogCoreRepository } from './mood-category-log-core.repository';
import { CreateDimMoodCategoryInput } from './inputs/create-dim-mood-category.input';

@Injectable()
export class MoodCategoryLogCoreService {
  constructor(
    private readonly moodCategoryLogCoreRepository: MoodCategoryLogCoreRepository,
  ) {}

  @Transactional()
  public async createDimMoodCategory(
    input: CreateDimMoodCategoryInput,
    updatedAt: Date,
  ) {
    await this.moodCategoryLogCoreRepository.insertDimMoodCategory({
      ...input,
      validFrom: updatedAt,
    });
  }
}
