import { Module } from '@nestjs/common';
import { PushTokenCoreRepository } from './push-token-core.repository';
import { PushTokenCoreService } from './push-token-core.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PushTokenCoreRepository, PushTokenCoreService],
  exports: [PushTokenCoreService],
})
export class PushTokenCoreModule {}
