import { Module } from '@nestjs/common';
import { RewardCoreRepository } from './reward-core.repository';
import { RewardCoreService } from './reward-core.service';

@Module({
  providers: [RewardCoreRepository, RewardCoreService],
  exports: [RewardCoreService],
})
export class RewardCoreModule {}
