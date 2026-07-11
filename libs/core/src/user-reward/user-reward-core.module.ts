import { Module } from '@nestjs/common';
import { UserRewardCoreService } from './user-reward-core.service';
import { UserRewardCoreRepository } from './user-reward-core.repository';

@Module({
  providers: [UserRewardCoreService, UserRewardCoreRepository],
  exports: [UserRewardCoreService],
})
export class UserRewardCoreModule {}
