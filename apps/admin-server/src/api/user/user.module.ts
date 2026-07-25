import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCoreModule } from '@libs/core/user/user-core.module';
import { ManagedUserController } from './managed-user.controller';
import { ManagedUserService } from './managed-user.service';

@Module({
  imports: [UserCoreModule],
  controllers: [UserController, ManagedUserController],
  providers: [UserService, ManagedUserService],
})
export class UserModule {}
