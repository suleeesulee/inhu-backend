import { Module } from '@nestjs/common';
import { UserLogCoreService } from './user-log-core.service';
import { UserLogCoreRepository } from './user-log-core.repository';

@Module({
  imports: [],
  providers: [UserLogCoreService, UserLogCoreRepository],
  exports: [UserLogCoreService],
})
export class UserLogCoreModule {}
