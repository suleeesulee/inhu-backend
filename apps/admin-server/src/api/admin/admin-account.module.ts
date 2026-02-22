import { AdminAccountCoreModule } from '@libs/core/admin-account/admin-account-core.module';
import { Module } from '@nestjs/common';
import { AdminAccountController } from './admin-account.controller';
import { AdminAccountService } from './admin-account.service';

@Module({
  imports: [AdminAccountCoreModule],
  controllers: [AdminAccountController],
  providers: [AdminAccountService],
  exports: [AdminAccountService],
})
export class AdminAccountModule {}
