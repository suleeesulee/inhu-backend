import { Module } from '@nestjs/common';
import { KeywordLogCoreService } from './keyword-log-core.service';
import { KeywordLogCoreRepository } from './keyword-log-core.repository';

@Module({
  imports: [],
  providers: [KeywordLogCoreService, KeywordLogCoreRepository],
  exports: [KeywordLogCoreService],
})
export class KeywordLogCoreModule {}
