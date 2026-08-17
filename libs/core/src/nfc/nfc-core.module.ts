import { Module } from '@nestjs/common';
import { NfcCoreRepository } from './nfc-core.repository';
import { NfcCoreService } from './nfc-core.service';

@Module({
  providers: [NfcCoreRepository, NfcCoreService],
  exports: [NfcCoreService],
})
export class NfcCoreModule {}
