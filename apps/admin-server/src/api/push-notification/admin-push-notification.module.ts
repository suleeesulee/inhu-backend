import { PushNotificationModule } from '@libs/common/modules/push-notification/push-notification.module';
import { Module } from '@nestjs/common';
import { AdminPushNotificationController } from './admin-push-notification.controller';
import { AdminPushNotificationService } from './admin-push-notification.service';
import { PushTokenCoreModule } from '@libs/core/push-notification/push-token-core.module';

@Module({
  imports: [PushNotificationModule, PushTokenCoreModule],
  providers: [AdminPushNotificationService],
  controllers: [AdminPushNotificationController],
})
export class AdminPushNotificationModule {}
