import { MailModule } from '@libs/common/modules/mail/mail.module';
import { Module } from '@nestjs/common';
import { UserMailController } from './user-mail.controller';
import { UserMailService } from './user-mail.service';
import { RedisModule } from '@libs/common/modules/redis/redis.module';
import { UserCoreModule } from '@libs/core/user/user-core.module';
import { ConfigModule } from '@nestjs/config';
import userMailConfig from './config/user-mail.config';

@Module({
  imports: [
    MailModule,
    RedisModule,
    UserCoreModule,
    ConfigModule.forFeature(userMailConfig),
  ],
  controllers: [UserMailController],
  providers: [UserMailService],
})
export class UserMailModule {}
