import { SELECT_FREE_TAG } from '@libs/core/free-tag/model/prisma-type/select-free-tag';
import { SELECT_SEARCH_TAG } from '@libs/core/search-tag/model/prisma-type/select-search-tag';
import { Prisma } from '@prisma/client';

export const SELECT_PLACE_OVERVIEW =
  Prisma.validator<Prisma.PlaceDefaultArgs>()({
    select: {
      idx: true,
      name: true,
      tel: true,
      reviewCount: true,
      bookmarkCount: true,
      activatedAt: true,
      isClosedOnHoliday: true,
      createdAt: true,
      permanentlyClosedAt: true,
      nfcList: {
        select: { idx: true },
        where: { deletedAt: null },
        take: 1,
      },
      placeImageList: {
        select: { path: true },
        where: { deletedAt: null },
        orderBy: { idx: 'asc' },
      },
      placeKeywordCountList: {
        take: 2,
        orderBy: [{ count: 'desc' }, { keyword: { idx: 'asc' } }],
        select: {
          keyword: { select: { content: true, idx: true } },
        },
      },
      placeTypeMappingList: {
        select: {
          placeTypeIdx: true,
        },
      },
      roadAddress: {
        select: {
          idx: true,
          addressName: true,
          detailAddress: true,
          addressX: true,
          addressY: true,
        },
      },
      closedDayList: {
        select: {
          idx: true,
          day: true,
          week: true,
        },
      },
      operatingHourList: {
        select: {
          idx: true,
          day: true,
          startAt: true,
          endAt: true,
        },
      },
      weeklyClosedDayList: {
        select: {
          idx: true,
          closedDate: true,
          type: true,
        },
      },
      breakTimeList: {
        select: {
          idx: true,
          day: true,
          startAt: true,
          endAt: true,
        },
      },
      placeMainCategoryMappingList: {
        select: {
          mainCategoryIdx: true,
        },
      },
      placeMoodCategoryMappingList: {
        select: {
          moodCategoryIdx: true,
        },
      },
      placeFreeTagMappingList: {
        select: {
          freeTag: SELECT_FREE_TAG,
        },
      },
      placeSearchTagMappingList: {
        select: {
          searchTag: SELECT_SEARCH_TAG,
        },
      },
    },
  });

export type SelectPlaceOverview = Prisma.PlaceGetPayload<
  typeof SELECT_PLACE_OVERVIEW
>;
