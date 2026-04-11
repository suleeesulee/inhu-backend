import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_PLACE_SECTION,
  SelectPlaceSection,
} from './model/prisma-type/select-place-section';
import { CreatePlaceSectionInput } from './inputs/create-place-section.input';
import { UpdatePlaceSectionInput } from './inputs/update-place-section.input';
import { Prisma } from '@prisma/client';
import { GetPlaceSectionAllInput } from './inputs/get-place-section-all.input';

@Injectable()
export class PlaceSectionCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectPlaceSectionByIdx(
    idx: number,
  ): Promise<SelectPlaceSection | null> {
    return await this.txHost.tx.placeSection.findUnique({
      ...SELECT_PLACE_SECTION,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectPlaceSectionAll(
    input?: GetPlaceSectionAllInput,
  ): Promise<SelectPlaceSection[]> {
    return await this.txHost.tx.placeSection.findMany({
      ...SELECT_PLACE_SECTION,
      where: {
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      take: input?.take,
      skip: input?.skip,
    });
  }

  public async createPlaceSection(
    input: CreatePlaceSectionInput,
  ): Promise<SelectPlaceSection> {
    return await this.txHost.tx.placeSection.create({
      ...SELECT_PLACE_SECTION,
      data: {
        title: input.title,
        parameter: input.parameter as unknown as Prisma.InputJsonValue,
        sortOrder: input.sortOrder,
      },
    });
  }

  public async updatePlaceSectionByIdx(
    idx: number,
    input: UpdatePlaceSectionInput,
  ): Promise<void> {
    await this.txHost.tx.placeSection.update({
      data: {
        title: input.title,
        parameter: input.parameter as unknown as Prisma.InputJsonValue,
        sortOrder: input.sortOrder,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async incrementPlaceSectionSortOrder(
    oldOrder: number,
    newOrder: number,
  ): Promise<void> {
    if (newOrder < oldOrder) {
      await this.txHost.tx.placeSection.updateMany({
        where: {
          sortOrder: { gte: newOrder, lt: oldOrder },
          deletedAt: null,
        },
        data: { sortOrder: { increment: 1 } },
      });
    } else if (newOrder > oldOrder) {
      await this.txHost.tx.placeSection.updateMany({
        where: {
          sortOrder: { gt: oldOrder, lte: newOrder },
          deletedAt: null,
        },
        data: { sortOrder: { decrement: 1 } },
      });
    }
  }

  public async softDeletePlaceSectionByIdx(idx: number): Promise<void> {
    await this.txHost.tx.placeSection.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async getPlaceSectionCount(): Promise<number> {
    return await this.txHost.tx.placeSection.count({
      where: {
        deletedAt: null,
      },
    });
  }
}
