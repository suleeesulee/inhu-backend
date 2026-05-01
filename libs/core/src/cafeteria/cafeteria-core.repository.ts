import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_CAFETERIA,
  SelectCafeteria,
} from './model/prisma-type/select-cafeteria';
import { CreateCafeteriaInput } from './inputs/create-cafeteria.input';
import { UpdateCafeteriaInput } from './inputs/update-cafeteria.input';

@Injectable()
export class CafeteriaCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectCafeteriaByIdx(
    idx: number,
  ): Promise<SelectCafeteria | null> {
    return await this.txHost.tx.cafeteria.findUnique({
      ...SELECT_CAFETERIA,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectCafeteriaAll(): Promise<SelectCafeteria[]> {
    return await this.txHost.tx.cafeteria.findMany({
      ...SELECT_CAFETERIA,
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
    });
  }

  public async insertCafeteria(
    input: CreateCafeteriaInput,
  ): Promise<SelectCafeteria> {
    return await this.txHost.tx.cafeteria.create({
      ...SELECT_CAFETERIA,
      data: {
        name: input.name,
      },
    });
  }

  public async updateCafeteriaByIdx(
    idx: number,
    input: UpdateCafeteriaInput,
  ): Promise<void> {
    await this.txHost.tx.cafeteria.update({
      data: {
        name: input.name,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async softDeleteCafeteriaByIdx(idx: number): Promise<void> {
    await this.txHost.tx.cafeteria.update({
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
