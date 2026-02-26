import { Module } from '@nestjs/common';
import { KeywordCdcController } from './keyword-cdc.controller';
import { KeywordCdcService } from './keyword-cdc.service';
import { KeywordLogCoreModule } from '@libs/log-core/keyword-log-core/keyword-log-core.module';

@Module({
  imports: [KeywordLogCoreModule],
  controllers: [KeywordCdcController],
  providers: [KeywordCdcService],
})
export class KeywordCdcModule {}
