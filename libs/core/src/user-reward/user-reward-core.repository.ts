import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRewardCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  /**
   * 랭크 포함 유저 리워드 보관함 조회
   */
  public async selectUserRewardWithRankByUserIdx() {}
  public async insertUserReward() {}
}
