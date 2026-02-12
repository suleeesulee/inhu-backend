import { Module } from '@nestjs/common';
import { MainCategoryCdcController } from './main-category-cdc.controller';
import { MainCategoryCdcService } from './main-category-cdc.service';

@Module({
  imports: [],
  controllers: [MainCategoryCdcController],
  providers: [MainCategoryCdcService],
})
export class MainCategoryCdcModule {}
