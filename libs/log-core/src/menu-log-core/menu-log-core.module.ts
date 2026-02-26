import { Module } from '@nestjs/common';
import { MenuLogCoreService } from './menu-log-core.service';
import { MenuLogCoreRepository } from './menu-log-core.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [MenuLogCoreService, MenuLogCoreRepository],
  exports: [MenuLogCoreService],
})
export class MenuLogCoreModule {}
