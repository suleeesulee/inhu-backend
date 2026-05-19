import { MailModule } from '@libs/common/modules/mail/mail.module';
import { Module } from '@nestjs/common';
import { UserMailController } from './user-mail.controller';
import { UserMailService } from './user-mail.service';
import { RedisModule } from '@libs/common/modules/redis/redis.module';
import { UserCoreModule } from '@libs/core/user/user-core.module';

@Module({
  imports: [MailModule, RedisModule, UserCoreModule],
  controllers: [UserMailController],
  providers: [UserMailService],
})
export class UserMailModule {}
