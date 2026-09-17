import { Module } from '@nestjs/common';
import { NotificationCoreRepository } from './notification-core.repository';
import { NotificationCoreService } from './notification-core.service';

/**
 * 알림 코어 모듈
 *
 * @publicApi
 */
@Module({
  providers: [NotificationCoreRepository, NotificationCoreService],
  exports: [NotificationCoreService],
})
export class NotificationCoreModule {}
