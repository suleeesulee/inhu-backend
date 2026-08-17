import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { NoticeCoreModule } from '@libs/core/notice/notice-core.module';

@Module({
  imports: [NoticeCoreModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
