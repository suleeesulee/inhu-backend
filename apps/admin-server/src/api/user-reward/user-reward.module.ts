import { MailModule } from '@libs/common/modules/mail/mail.module';
import { RedlockModule } from '@libs/common/modules/redlock/redlock.module';
import { UserCoreModule } from '@libs/core/user/user-core.module';
import { UserRewardCoreModule } from '@libs/core/user-reward/user-reward-core.module';
import { LeagueSeasonCoreModule } from '@libs/core/league-season/league-season-core.module';
import { RewardCoreModule } from '@libs/core/reward/reward-core.module';
import { Module } from '@nestjs/common';
import { UserRewardController } from './user-reward.controller';
import { UserRewardService } from './user-reward.service';

@Module({
  imports: [
    UserRewardCoreModule,
    LeagueSeasonCoreModule,
    UserCoreModule,
    RewardCoreModule,
    MailModule,
    RedlockModule,
  ],
  controllers: [UserRewardController],
  providers: [UserRewardService],
})
export class UserRewardModule {}
