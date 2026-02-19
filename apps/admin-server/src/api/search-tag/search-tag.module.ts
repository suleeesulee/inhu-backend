import { SearchTagCoreModule } from '@libs/core/search-tag/search-tag-core.module';
import { Module } from '@nestjs/common';
import { SearchTagController } from './search-tag.controller';
import { SearchTagService } from './search-tag.service';

@Module({
  imports: [SearchTagCoreModule],
  controllers: [SearchTagController],
  providers: [SearchTagService],
  exports: [SearchTagService],
})
export class SearchTagModule {}
