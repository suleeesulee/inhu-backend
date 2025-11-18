import { Injectable, NotFoundException } from '@nestjs/common';
import { GetAllMenuDto } from './dto/request/get-all-menu.dto';
import { MenuEntity } from './entity/menu.entity';
import { CreateMenuDto } from './dto/request/create-menu.dto';
import { UpdateMenuDto } from './dto/request/update-menu.dto';
import { MenuCoreService } from '@libs/core/menu/menu-core.service';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { UpdateMenuSortOrderDto } from './dto/request/update-menu-sort-order.dto';
import { ReviewCoreService } from '@libs/core/review/review-core.service';
import { NaverMenuService } from '@libs/common/modules/naver-menu/naver-menu.service';
import { NaverMenuEntity } from './entity/naver-menu.entity';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { v4 as uuidv4 } from 'uuid';
import { S3Folder } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { MenuCrawlingDto } from './dto/request/menu-crawling.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly menuCoreService: MenuCoreService,
    private readonly placeCoreService: PlaceCoreService,
    private readonly reviewCoreService: ReviewCoreService,
    private readonly naverMenuService: NaverMenuService,
    private readonly s3Service: S3Service,
  ) {}

  public async getAllMenuByPlaceIdx(
    placeIdx: number,
    dto: GetAllMenuDto,
  ): Promise<{ hasNext: boolean; menuList: MenuEntity[] }> {
    const pageSize = dto.row;
    const take = pageSize + 1;
    const skip = (dto.page - 1) * pageSize;

    const menuList = await this.menuCoreService.getMenuAllByPlaceIdx(placeIdx, {
      take,
      skip,
      order: dto.order,
    });

    return {
      menuList: menuList.slice(0, pageSize).map(MenuEntity.fromModel),
      hasNext: menuList.length > pageSize,
    };
  }

  public async createMenuByPlaceIdx(
    placeIdx: number,
    dto: CreateMenuDto,
  ): Promise<MenuEntity> {
    const place = await this.placeCoreService.getPlaceByIdx(placeIdx);

    if (!place) {
      throw new NotFoundException('Cannot find place with given idx');
    }

    const menuModel = await this.menuCoreService.createMenu(placeIdx, {
      name: dto.name,
      price: dto.price,
      content: dto.content,
      imagePath: dto.imagePath,
      isFlexible: dto.isFlexible,
    });

    return MenuEntity.fromModel(menuModel);
  }

  public async crawlingNaverMenuViaPlaceUrl(
    dto: MenuCrawlingDto,
  ): Promise<NaverMenuEntity[]> {
    const naverMenuList = await this.naverMenuService.extractNaverMenu(dto.url);

    return await Promise.all(
      naverMenuList.map(async (menu) =>
        NaverMenuEntity.fromModel({
          name: menu.name,
          content: menu.content,
          price: menu.price,
          imagePath: await this.uploadImage(menu.imagePath),
          isFlexible: menu.isFlexible,
        }),
      ),
    );
  }

  public async createMenuReview(
    menuIdx: number,
    reviewIdx: number,
  ): Promise<void> {
    const menu = await this.menuCoreService.getMenuByIdx(menuIdx);
    if (!menu) {
      throw new NotFoundException('Cannot find menu with given idx');
    }

    const review = await this.reviewCoreService.getReviewByIdx(reviewIdx);
    if (!review) {
      throw new NotFoundException('Cannot find review with given idx');
    }

    await this.menuCoreService.createMenuReview(reviewIdx, menuIdx);
  }

  public async updateMenuByPlaceIdx(
    menuIdx: number,
    dto: UpdateMenuDto,
  ): Promise<void> {
    const menu = await this.menuCoreService.getMenuByIdx(menuIdx);

    if (!menu) {
      throw new NotFoundException('Cannot find menu with given idx');
    }

    await this.menuCoreService.updateMenuByIdx(menuIdx, {
      name: dto.name,
      price: dto.price,
      content: dto.content,
      imagePath: dto.imagePath,
      isFlexible: dto.isFlexible,
    });
  }

  public async updateMenuSortOrderByPlaceIdx(
    menuIdx: number,
    dto: UpdateMenuSortOrderDto,
  ): Promise<void> {
    return await this.menuCoreService.updateMenuSortOrderByIdx(
      menuIdx,
      dto.sortOrder,
    );
  }

  public async deleteMenuByIdx(menuIdx: number): Promise<void> {
    const menu = await this.menuCoreService.getMenuByIdx(menuIdx);

    if (!menu) {
      throw new NotFoundException('Cannot find menu with given idx');
    }

    await this.menuCoreService.deleteMenuByIdx(menuIdx);
  }

  public async deleteMenuReviewByReviewIdxAndMenuIdx(
    reviewIdx: number,
    menuIdx: number,
  ): Promise<void> {
    const menuReview =
      await this.menuCoreService.getMenuReviewByMenuIdxAndReviewIdx(
        menuIdx,
        reviewIdx,
      );
    if (!menuReview) {
      throw new NotFoundException(
        'Cannot find menu review with given menuIdx and reviewIdx',
      );
    }

    await this.menuCoreService.deleteMenuReviewByReviewIdxAndMenuIdx(
      reviewIdx,
      menuIdx,
    );
  }

  private async uploadImage(url: string | null): Promise<string | null> {
    if (!url) return null;

    const model = await this.s3Service.uploadImageFromUrl(
      {
        name: uuidv4() + '.png',
        path: S3Folder.MENU,
      },
      url,
    );

    return model.path;
  }
}
