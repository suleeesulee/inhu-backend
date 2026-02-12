import { Module } from '@nestjs/common';
import { MainCategoryCdcController } from './main-category-cdc.controller';
import { MainCategoryCdcService } from './main-category-cdc.service';
import { MainCategoryLogCoreModule } from '@libs/log-core/main-category-log-core/main-category-log-core.module';

@Module({
  imports: [MainCategoryLogCoreModule],
  controllers: [MainCategoryCdcController],
  providers: [MainCategoryCdcService],
})
export class MainCategoryCdcModule {}
