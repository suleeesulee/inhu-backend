import { MainCategoryLogCoreService } from '@libs/log-core/main-category-log-core/main-category-log-core.service';
import { Injectable } from '@nestjs/common';
import { MainCategoryTb } from './events/main-category-tb.event';

@Injectable()
export class MainCategoryCdcService {
  constructor(
    private readonly mainCategoryLogCoreService: MainCategoryLogCoreService,
  ) {}

  public async createDimMainCategory(mainCategory: MainCategoryTb, time: Date) {
    await this.mainCategoryLogCoreService.createDimMainCategory(
      {
        idx: mainCategory.idx,
        content: mainCategory.content,
        deletedAt: mainCategory.deleted_at
          ? new Date(mainCategory.deleted_at)
          : null,
        registeredAt: new Date(mainCategory.created_at),
      },
      time,
    );
  }
}
