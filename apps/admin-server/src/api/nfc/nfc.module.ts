import { NfcCoreModule } from '@libs/core/nfc/nfc-core.module';
import { Module } from '@nestjs/common';
import { NfcController } from './nfc.controller';
import { NfcService } from './nfc.service';
import { ConfigModule } from '@nestjs/config';
import nfcConfig from './config/nfc.config';

@Module({
  imports: [NfcCoreModule, ConfigModule.forFeature(nfcConfig)],
  controllers: [NfcController],
  providers: [NfcService],
})
export class NfcModule {}
