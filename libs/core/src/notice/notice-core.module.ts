import { Module } from '@nestjs/common';
import { NoticeCoreRepository } from './notice-core.repository';
import { NoticeCoreService } from './notice-core.service';

/**
 * 공지사항 코어 모듈
 *
 * @publicApi
 */
@Module({
  providers: [NoticeCoreRepository, NoticeCoreService],
  exports: [NoticeCoreService],
})
export class NoticeCoreModule {}
