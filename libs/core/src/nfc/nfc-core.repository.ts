import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_NFC, SelectNfc } from './model/prisma-type/select-nfc';
import { CreateNfcInput } from './inputs/create-nfc.input';
import { UpdateNfcInput } from './inputs/update-nfc.input';
import { GetNfcAllInput } from './inputs/get-nfc-all.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class NfcCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectNfcByIdx(idx: number): Promise<SelectNfc | null> {
    return await this.txHost.tx.nfc.findUnique({
      ...SELECT_NFC,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectNfcByUid(uid: string): Promise<SelectNfc | null> {
    return await this.txHost.tx.nfc.findFirst({
      ...SELECT_NFC,
      where: {
        uid,
        deletedAt: null,
      },
    });
  }

  public async selectNfcAll(input: GetNfcAllInput): Promise<SelectNfc[]> {
    const order = input.order ?? 'desc';

    return await this.txHost.tx.nfc.findMany({
      ...SELECT_NFC,
      where: {
        deletedAt: null,
        ...this.getPlaceIdxFilterWhereClause(input.placeIdx),
        ...this.getActivatedAtFilterWhereClause(input.activated),
      },
      orderBy: [{ createdAt: order }, { idx: order }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectNfcCount(input: GetNfcAllInput): Promise<number> {
    return await this.txHost.tx.nfc.count({
      where: {
        deletedAt: null,
        ...this.getPlaceIdxFilterWhereClause(input.placeIdx),
        ...this.getActivatedAtFilterWhereClause(input.activated),
      },
    });
  }

  public async insertNfc(input: CreateNfcInput): Promise<SelectNfc> {
    return await this.txHost.tx.nfc.create({
      ...SELECT_NFC,
      data: {
        placeIdx: input.placeIdx,
        score: input.score,
        uid: input.uid,
        activatedAt: input.activatedAt,
      },
    });
  }

  public async updateNfcByIdx(
    idx: number,
    input: UpdateNfcInput,
  ): Promise<void> {
    await this.txHost.tx.nfc.update({
      where: { idx },
      data: {
        placeIdx: input.placeIdx,
        score: input.score,
        uid: input.uid,
        activatedAt: input.activatedAt,
      },
    });
  }

  public async softDeleteNfcByIdx(idx: number): Promise<void> {
    await this.txHost.tx.nfc.update({
      data: { deletedAt: new Date() },
      where: { idx, deletedAt: null },
    });
  }

  private getActivatedAtFilterWhereClause(
    activated?: boolean,
  ): Prisma.NfcWhereInput {
    if (activated === undefined) {
      return {};
    }

    if (activated) {
      return { activatedAt: { not: null } };
    }

    return { activatedAt: null };
  }

  private getPlaceIdxFilterWhereClause(
    placeIdx?: number,
  ): Prisma.NfcWhereInput {
    if (placeIdx === undefined) {
      return {};
    }

    return { placeIdx };
  }
}
