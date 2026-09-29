import { NotificationCoreModule } from '@libs/core/notification/notification-core.module';
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [NotificationCoreModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
