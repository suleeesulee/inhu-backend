import { MagazineLogCoreService } from '@libs/log-core/magazine-log-core/magazine-log-core.service';
import { Injectable } from '@nestjs/common';
import { MagazineTb } from './events/magazine-tb.event';
import { MagazineMainCategoryMappingTb } from './events/magazine-main-category-mapping-tb.event';
import { MagazineMoodCategoryMappingTb } from './events/magazine-mood-category-mapping-tb.event';
import { PlaceTypeMagazineMappingTb } from './events/place-type-magazine-mapping-tb.event';
import { MagazinePlaceTb } from './events/magazine-place-tb.event';
import { MagazineLikeTb } from './events/magazine-like-tb.event';

@Injectable()
export class MagazineCdcService {
  constructor(
    private readonly magazineLogCoreService: MagazineLogCoreService,
  ) {}

  public async createDimMagazine(magazine: MagazineTb, time: Date) {
    await this.magazineLogCoreService.createDimMagazine(
      {
        idx: magazine.idx,
        authorIdx: magazine.author_idx,
        title: magazine.title,
        description: magazine.description,
        content: magazine.content,
        thumbnailImagePath: magazine.thumbnail_image_path,
        isTitleVisible: magazine.is_title_visible,
        likeCount: magazine.like_count,
        viewCount: magazine.view_count,
        registeredAt: new Date(magazine.created_at),
        activatedAt: magazine.activated_at
          ? new Date(magazine.activated_at)
          : null,
        deletedAt: magazine.deleted_at ? new Date(magazine.deleted_at) : null,
      },
      time,
    );
  }

  public async createDimMagazineLike(
    magazineLike: MagazineLikeTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.magazineLogCoreService.createDimMagazineLike(
      {
        magazineIdx: magazineLike.magazine_idx,
        userIdx: magazineLike.user_idx,
        registeredAt: new Date(magazineLike.created_at),
        deletedAt,
      },
      time,
    );
  }

  public async createDimPlaceTypeMagazineMapping(
    placeTypeMagazineMapping: PlaceTypeMagazineMappingTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.magazineLogCoreService.createDimPlaceTypeMagazineMapping(
      {
        placeTypeIdx: placeTypeMagazineMapping.place_type_idx,
        magazineIdx: placeTypeMagazineMapping.magazine_idx,
        deletedAt,
      },
      time,
    );
  }

  public async createDimMagazineMainCategoryMapping(
    magazineMainCategoryMapping: MagazineMainCategoryMappingTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.magazineLogCoreService.createDimMagazineMainCategoryMapping(
      {
        mainCategoryIdx: magazineMainCategoryMapping.main_category_idx,
        magazineIdx: magazineMainCategoryMapping.magazine_idx,
        deletedAt,
      },
      time,
    );
  }

  public async createDimMagazineMoodCategoryMapping(
    magazineMoodCategoryMapping: MagazineMoodCategoryMappingTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.magazineLogCoreService.createDimMagazineMoodCategoryMapping(
      {
        moodCategoryIdx: magazineMoodCategoryMapping.mood_category_idx,
        magazineIdx: magazineMoodCategoryMapping.magazine_idx,
        deletedAt,
      },
      time,
    );
  }

  public async createDimMagazinePlace(
    magazinePlace: MagazinePlaceTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.magazineLogCoreService.createDimMagazinePlace(
      {
        magazineIdx: magazinePlace.magazine_idx,
        placeIdx: magazinePlace.place_idx,
        deletedAt,
      },
      time,
    );
  }
}
