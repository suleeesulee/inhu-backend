import { Injectable } from '@nestjs/common';
import { MoodCategoryTb } from './events/mood-category-tb.event';
import { MoodCategoryLogCoreService } from '@libs/log-core/mood-category-log-core/mood-category-log-core.service';

@Injectable()
export class MoodCategoryCdcService {
  constructor(
    private readonly moodCategoryLogCoreService: MoodCategoryLogCoreService,
  ) {}

  public async createDimMoodCategory(moodCategory: MoodCategoryTb, time: Date) {
    await this.moodCategoryLogCoreService.createDimMoodCategory(
      {
        idx: moodCategory.idx,
        content: moodCategory.content,
        deletedAt: moodCategory.deleted_at
          ? new Date(moodCategory.deleted_at)
          : null,
        registeredAt: new Date(moodCategory.created_at),
      },
      time,
    );
  }
}
