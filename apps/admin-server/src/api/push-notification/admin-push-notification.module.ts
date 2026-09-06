import { PushNotificationModule } from '@libs/common/modules/push-notification/push-notification.module';
import { Module } from '@nestjs/common';
import { AdminPushNotificationController } from './admin-push-notification.controller';

@Module({
  imports: [PushNotificationModule],
  controllers: [AdminPushNotificationController],
})
export class AdminPushNotificationModule {}
