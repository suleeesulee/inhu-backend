import { AdminAccountCoreModule } from '@libs/core/admin-account/admin-account-core.module';
import { Module } from '@nestjs/common';
import { AdminAccountController } from './admin-account.controller';
import { AdminAccountService } from './admin-account.service';
import { HashModule } from '@libs/common/modules/hash/hash.module';

@Module({
  imports: [AdminAccountCoreModule, HashModule],
  controllers: [AdminAccountController],
  providers: [AdminAccountService],
  exports: [AdminAccountService],
})
export class AdminAccountModule {}
