import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_MAGAZINE_SECTION,
  SelectMagazineSection,
} from './model/prisma-type/select-magazine-section';
import { CreateMagazineSectionInput } from './inputs/create-place-section.input';
import { UpdateMagazineSectionInput } from './inputs/update-place-section.input';
import { Prisma } from '@prisma/client';
import { GetMagazineSectionAllInput } from './inputs/get-place-section-all.input';

@Injectable()
export class MagazineSectionCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectMagazineSectionByIdx(
    idx: number,
  ): Promise<SelectMagazineSection | null> {
    return await this.txHost.tx.placeSection.findUnique({
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
    return await this.txHost.tx.placeSection.findMany({
      ...SELECT_MAGAZINE_SECTION,
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input?.take,
      skip: input?.skip,
    });
  }

  public async createMagazineSection(
    input: CreateMagazineSectionInput,
  ): Promise<SelectMagazineSection> {
    return await this.txHost.tx.placeSection.create({
      ...SELECT_MAGAZINE_SECTION,
      data: {
        title: input.title,
        parameter: input.parameter as unknown as Prisma.InputJsonValue,
      },
    });
  }

  public async updateMagazineSectionByIdx(
    idx: number,
    input: UpdateMagazineSectionInput,
  ): Promise<void> {
    await this.txHost.tx.placeSection.update({
      data: {
        title: input.title,
        parameter: input.parameter as unknown as Prisma.InputJsonValue,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async softDeleteMagazineSectionByIdx(idx: number): Promise<void> {
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
}
