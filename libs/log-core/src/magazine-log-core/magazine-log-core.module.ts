import { Module } from '@nestjs/common';
import { MagazineLogCoreService } from './magazine-log-core.service';
import { MagazineLogCoreRepository } from './magazine-log-core.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [MagazineLogCoreService, MagazineLogCoreRepository],
  exports: [MagazineLogCoreService],
})
export class MagazineLogCoreModule {}
