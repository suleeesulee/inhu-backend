import { CryptoModule } from '@libs/common/modules/crypto/crypto.module';
import { UserCoreRepository } from '@libs/core/user/user-core.repository';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { Module } from '@nestjs/common';
import { ManagedUserCoreRepository } from './managed-user-core.repository';
import { ManagedUserCoreService } from './managed-user-core.service';

/**
 * 사용자 코어 모듈
 *
 * @publicApi
 */
@Module({
  imports: [CryptoModule],
  providers: [
    UserCoreService,
    UserCoreRepository,
    ManagedUserCoreRepository,
    ManagedUserCoreService,
  ],
  exports: [UserCoreService, ManagedUserCoreService],
})
export class UserCoreModule {}
