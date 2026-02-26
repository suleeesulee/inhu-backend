import { MenuLogCoreService } from '@libs/log-core/menu-log-core/menu-log-core.service';
import { Injectable } from '@nestjs/common';
import { MenuTb } from './events/menu-tb.event';
import { MenuReviewTb } from './events/menu-review-tb.event';

@Injectable()
export class MenuCdcService {
  constructor(private readonly menuLogCoreService: MenuLogCoreService) {}

  public async createDimMenu(menu: MenuTb, time: Date) {
    await this.menuLogCoreService.createDimMenu(
      {
        idx: menu.idx,
        placeIdx: menu.place_idx,
        name: menu.name,
        content: menu.content,
        price: menu.price,
        imagePath: menu.image_path,
        isFlexible: menu.is_flexible,
        sortOrder: menu.sort_order,
        isMain: menu.is_main,
        registeredAt: new Date(menu.created_at),
        deletedAt: menu.deleted_at ? new Date(menu.deleted_at) : null,
      },
      time,
    );
  }

  public async createDimMenuReview(
    menuReview: MenuReviewTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.menuLogCoreService.createDimMenuReview(
      {
        menuIdx: menuReview.menu_idx,
        reviewIdx: menuReview.review_idx,
        deletedAt,
      },
      time,
    );
  }
}
