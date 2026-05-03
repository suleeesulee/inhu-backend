import { Module } from '@nestjs/common';
import { CafeteriaCoreService } from './cafeteria-core.service';
import { CafeteriaCoreRepository } from './cafeteria-core.repository';

@Module({
  providers: [CafeteriaCoreService, CafeteriaCoreRepository],
  exports: [CafeteriaCoreService],
})
export class CafeteriaCoreModule {}
