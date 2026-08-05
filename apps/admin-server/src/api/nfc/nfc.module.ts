import { NfcCoreModule } from '@libs/core/nfc/nfc-core.module';
import { Module } from '@nestjs/common';
import { NfcController } from './nfc.controller';
import { NfcService } from './nfc.service';

@Module({
  imports: [NfcCoreModule],
  controllers: [NfcController],
  providers: [NfcService],
})
export class NfcModule {}
