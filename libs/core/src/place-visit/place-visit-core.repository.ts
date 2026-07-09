import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_PLACE_VISIT,
  SelectPlaceVisit,
} from './model/prisma-type/select-place-visit';
import { CreatePlaceVisitInput } from './model/inputs/create-place-visit.input';

@Injectable()
export class PlaceVisitCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  // 방문 인증 내역용
  public async selectPlaceVisitAllByUserIdx(
    userIdx: number,
  ): Promise<SelectPlaceVisit[]> {
    return await this.txHost.tx.placeVisit.findMany({
      ...SELECT_PLACE_VISIT,
      where: {
        userIdx,
        nfc: {
          place: {
            deletedAt: null,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async selectPlaceVisitById(
    id: string,
  ): Promise<SelectPlaceVisit | null> {
    return await this.txHost.tx.placeVisit.findUnique({
      ...SELECT_PLACE_VISIT,
      where: {
        id,
        nfc: {
          place: {
            deletedAt: null,
          },
        },
      },
    });
  }

  // 현재 리그 순위 조회용
  public async selectUserScoreAllByPeriod(startAt: Date, endAt: Date) {}

  // 전체 리그 순위 조회용
  public async selectUserTotalScoreAll() {}

  public async insertPlaceVisit(
    input: CreatePlaceVisitInput,
  ): Promise<SelectPlaceVisit> {
    return await this.txHost.tx.placeVisit.create({
      ...SELECT_PLACE_VISIT,
      data: {
        userIdx: input.userIdx,
        nfcIdx: input.nfcIdx,
        score: input.score,
      },
    });
  }
}
