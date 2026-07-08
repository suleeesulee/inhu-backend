import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_NFC, SelectNfc } from './model/prisma-type/select-nfc';
import { CreateNfcInput } from './inputs/create-nfc.input';
import { UpdateNfcInput } from './inputs/update-nfc.input';

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

  public async selectNfcByPlaceIdx(
    placeIdx: number,
  ): Promise<SelectNfc | null> {
    return await this.txHost.tx.nfc.findFirst({
      ...SELECT_NFC,
      where: {
        placeIdx,
        deletedAt: null,
      },
    });
  }

  public async selectNfcAll(): Promise<SelectNfc[]> {
    return await this.txHost.tx.nfc.findMany({
      ...SELECT_NFC,
      where: {
        deletedAt: null,
      },
    });
  }

  public async insertNfc(input: CreateNfcInput): Promise<SelectNfc> {
    return await this.txHost.tx.nfc.create({
      ...SELECT_NFC,
      data: {
        placeIdx: input.placeIdx,
        score: input.score,
        tokenHash: input.tokenHash,
        activatedAt: input.activatedAt,
      },
    });
  }

  public async updateNfc(idx: number, input: UpdateNfcInput): Promise<void> {
    await this.txHost.tx.nfc.update({
      where: { idx },
      data: {
        placeIdx: input.placeIdx,
        score: input.score,
        tokenHash: input.tokenHash,
        activatedAt: input.activatedAt,
      },
    });
  }

  public async softDeleteNfc(idx: number): Promise<void> {
    await this.txHost.tx.nfc.update({
      data: { deletedAt: new Date() },
      where: { idx, deletedAt: null },
    });
  }
}
