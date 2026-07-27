import { FreeTagCoreModule } from '@libs/core/free-tag/free-tag-core.module';
import { Module } from '@nestjs/common';
import { FreeTagController } from './free-tag.controller';
import { FreeTagService } from './free-tag.service';

@Module({
  imports: [FreeTagCoreModule],
  controllers: [FreeTagController],
  providers: [FreeTagService],
  exports: [FreeTagService],
})
export class FreeTagModule {}
