import { Module } from '@nestjs/common';
import { UserRewardController } from './user-reward.controller';
import { UserRewardService } from './user-reward.service';
import { UserRewardCoreModule } from '@libs/core/user-reward/user-reward-core.module';
import { RewardCoreModule } from '@libs/core/reward/reward-core.module';
import { UserCoreModule } from '@libs/core/user/user-core.module';

@Module({
  imports: [UserRewardCoreModule, RewardCoreModule, UserCoreModule],
  controllers: [UserRewardController],
  providers: [UserRewardService],
})
export class UserRewardModule {}
