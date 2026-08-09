import { Module } from '@nestjs/common';
import { UserRankingCoreRepository } from './user-ranking-core.repository';
import { UserRankingCoreService } from './user-ranking-core.service';

@Module({
  providers: [UserRankingCoreService, UserRankingCoreRepository],
  exports: [UserRankingCoreService],
})
export class UserRankingCoreModule {}
