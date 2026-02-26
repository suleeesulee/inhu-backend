import { Module } from '@nestjs/common';
import { MagazineCdcController } from './magazine-cdc.controller';
import { MagazineCdcService } from './magazine-cdc.service';
import { MagazineLogCoreModule } from '@libs/log-core/magazine-log-core/magazine-log-core.module';

@Module({
  imports: [MagazineLogCoreModule],
  controllers: [MagazineCdcController],
  providers: [MagazineCdcService],
})
export class MagazineCdcModule {}
