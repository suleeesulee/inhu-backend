import { Module } from '@nestjs/common';
import { FreeTagCoreService } from './free-tag-core.service';
import { FreeTagCoreRepository } from './free-tag-core.repository';

@Module({
  providers: [FreeTagCoreService, FreeTagCoreRepository],
  exports: [FreeTagCoreService],
})
export class FreeTagCoreModule {}
