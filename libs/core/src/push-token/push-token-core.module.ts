import { Module } from '@nestjs/common';
import { PushTokenCoreRepository } from './push-token-core.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [PushTokenCoreRepository],
  exports: [],
})
export class PushTokenCoreModule {}
