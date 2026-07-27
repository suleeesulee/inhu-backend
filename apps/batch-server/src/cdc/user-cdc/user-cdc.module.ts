import { Module } from '@nestjs/common';
import { UserCdcController } from './user-cdc.controller';
import { UserLogCoreModule } from '@libs/log-core/user-log-core/user-log-core.module';
import { UserCdcService } from './user-cdc.service';

@Module({
  imports: [UserLogCoreModule],
  controllers: [UserCdcController],
  providers: [UserCdcService],
  exports: [],
})
export class UserCdcModule {}
