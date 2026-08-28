import { RewardCoreModule } from '@libs/core/reward/reward-core.module';
import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';

@Module({
  imports: [RewardCoreModule],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
