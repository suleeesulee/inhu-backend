import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_PLACE_SECTION,
  SelectPlaceSection,
} from './model/prisma-type/select-place-section';
import { CreatePlaceSectionInput } from './inputs/create-place-section.input';
import { Prisma } from '@prisma/client';
import { UpdatePlaceSectionInput } from './inputs/update-place-section.input';

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

  public async selectPlaceSectionAll(): Promise<SelectPlaceSection[]> {
    return await this.txHost.tx.placeSection.findMany({
      ...SELECT_PLACE_SECTION,
      where: {
        deletedAt: null,
      },
    });
  }

  public async createPlaceSection(
    input: CreatePlaceSectionInput,
  ): Promise<SelectPlaceSection> {
    return await this.txHost.tx.placeSection.create({
      ...SELECT_PLACE_SECTION,
      data: {
        title: input.title,
        parameter: input.parameter,
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
        parameter: input.parameter,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
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
}
