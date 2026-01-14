import { Module } from '@nestjs/common';
import { UserCdcController } from './user-cdc.controller';

@Module({
  imports: [],
  controllers: [UserCdcController],
  providers: [],
  exports: [],
})
export class UserCdcModule {}
