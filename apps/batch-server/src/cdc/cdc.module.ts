import { Module } from '@nestjs/common';
import { UserCdcModule } from './user-cdc/user-cdc.module';

@Module({
  imports: [UserCdcModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CdcModule {}
