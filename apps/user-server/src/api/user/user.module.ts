import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCoreModule } from '@libs/core/user/user-core.module';
import { RedisModule } from '@libs/common/modules/redis/redis.module';

@Module({
  imports: [UserCoreModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
