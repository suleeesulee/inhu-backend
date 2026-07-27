import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { ConfigModule } from '@nestjs/config';
import cryptoConfig from './config/crypto.config';

@Module({
  imports: [ConfigModule.forFeature(cryptoConfig)],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
