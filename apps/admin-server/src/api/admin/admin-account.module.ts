import { AdminAccountCoreModule } from '@libs/core/admin-account/admin-account-core.module';
import { Module } from '@nestjs/common';
import { AdminAccountController } from './admin-account.controller';
import { AdminAccountService } from './admin-account.service';
import { HashModule } from '@libs/common/modules/hash/hash.module';
import { LoginTokenModule } from '@admin/common/modules/login-token/login-token.module';

@Module({
  imports: [AdminAccountCoreModule, HashModule, LoginTokenModule],
  controllers: [AdminAccountController],
  providers: [AdminAccountService],
  exports: [AdminAccountService],
})
export class AdminAccountModule {}
