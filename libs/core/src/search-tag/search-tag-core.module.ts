import { Module } from '@nestjs/common';
import { SearchTagCoreService } from './search-tag-core.service';
import { SearchTagCoreRepository } from './search-tag-core.repository';

@Module({
  providers: [SearchTagCoreService, SearchTagCoreRepository],
  exports: [SearchTagCoreService],
})
export class SearchTagCoreModule {}
