import { Module } from '@nestjs/common';
import { MoodCategoryCdcController } from './mood-category-cdc.controller';
import { MoodCategoryCdcService } from './mood-category-cdc.service';

@Module({
  imports: [],
  controllers: [MoodCategoryCdcController],
  providers: [MoodCategoryCdcService],
})
export class MoodCategoryCdcModule {}
