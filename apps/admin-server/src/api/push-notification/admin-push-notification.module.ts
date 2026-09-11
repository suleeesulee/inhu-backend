import { PushNotificationModule } from '@libs/common/modules/push-notification/push-notification.module';
import { Module } from '@nestjs/common';
import { AdminPushNotificationController } from './admin-push-notification.controller';
import { AdminPushNotificationService } from './admin-push-notification.service';
import { PushTokenCoreModule } from '@libs/core/push-notification/push-token-core.module';
import { InstallationLifecycleCoreModule } from '@libs/core/installation-lifecycle/installation-lifecycle-core.module';

@Module({
  imports: [
    PushNotificationModule,
    PushTokenCoreModule,
    InstallationLifecycleCoreModule,
  ],
  providers: [AdminPushNotificationService],
  controllers: [AdminPushNotificationController],
})
export class AdminPushNotificationModule {}
