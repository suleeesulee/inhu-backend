import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_MAGAZINE_SECTION,
  SelectMagazineSection,
} from './model/prisma-type/select-magazine-section';
import { CreateMagazineSectionInput } from './inputs/create-magazine-section.input';
import { UpdateMagazineSectionInput } from './inputs/update-magazine-section.input';
import { Prisma } from '@prisma/client';
import { GetMagazineSectionAllInput } from './inputs/get-magazine-section-all.input';

@Injectable()
export class MagazineSectionCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectMagazineSectionByIdx(
    idx: number,
  ): Promise<SelectMagazineSection | null> {
    return await this.txHost.tx.magazineSection.findUnique({
      ...SELECT_MAGAZINE_SECTION,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectMagazineSectionAll(
    input?: GetMagazineSectionAllInput,
  ): Promise<SelectMagazineSection[]> {
    return await this.txHost.tx.magazineSection.findMany({
      ...SELECT_MAGAZINE_SECTION,
      where: {
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'desc',
      },
      take: input?.take,
      skip: input?.skip,
    });
  }

  public async createMagazineSection(
    input: CreateMagazineSectionInput,
  ): Promise<SelectMagazineSection> {
    return await this.txHost.tx.magazineSection.create({
      ...SELECT_MAGAZINE_SECTION,
      data: {
        title: input.title,
        parameter: input.parameter as unknown as Prisma.InputJsonValue,
        sortOrder: input.sortOrder,
      },
    });
  }

  public async updateMagazineSectionByIdx(
    idx: number,
    input: UpdateMagazineSectionInput,
  ): Promise<void> {
    await this.txHost.tx.magazineSection.update({
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

  public async incrementMagazineSectionSortOrder(
    oldOrder: number,
    newOrder: number,
  ): Promise<void> {
    if (newOrder < oldOrder) {
      await this.txHost.tx.magazineSection.updateMany({
        where: {
          sortOrder: { gte: newOrder, lt: oldOrder },
          deletedAt: null,
        },
        data: { sortOrder: { increment: 1 } },
      });
    } else if (newOrder > oldOrder) {
      await this.txHost.tx.magazineSection.updateMany({
        where: {
          sortOrder: { gt: oldOrder, lte: newOrder },
          deletedAt: null,
        },
        data: { sortOrder: { decrement: 1 } },
      });
    }
  }

  public async softDeleteMagazineSectionByIdx(idx: number): Promise<void> {
    await this.txHost.tx.magazineSection.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async getMagazineSectionCount(): Promise<number> {
    return await this.txHost.tx.magazineSection.count({
      where: {
        deletedAt: null,
      },
    });
  }
}
