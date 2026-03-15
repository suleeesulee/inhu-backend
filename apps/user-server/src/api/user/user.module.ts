import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCoreModule } from '@libs/core/user/user-core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserCoreModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
