import { CryptoModule } from '@libs/common/modules/crypto/crypto.module';
import { UserCoreRepository } from '@libs/core/user/user-core.repository';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { Module } from '@nestjs/common';

/**
 * 사용자 코어 모듈
 *
 * @publicApi
 */
@Module({
  imports: [CryptoModule],
  providers: [UserCoreService, UserCoreRepository],
  exports: [UserCoreService],
})
export class UserCoreModule {}
