import { Module } from '@nestjs/common';
import { MenuLogCoreModule } from '@libs/log-core/menu-log-core/menu-log-core.module';
import { MenuCdcController } from './menu-cdc.controller';
import { MenuCdcService } from './menu-cdc.service';

@Module({
  imports: [MenuLogCoreModule],
  controllers: [MenuCdcController],
  providers: [MenuCdcService],
})
export class MenuCdcModule {}
