import { KafkaModule } from '@libs/common/modules/kafka/kafka.module';
import { PushNotificationModule } from '@libs/common/modules/push-notification/push-notification.module';
import { NotificationCoreModule } from '@libs/core/notification/notification-core.module';
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
    NotificationCoreModule,
    KafkaModule.register({
      clientId: 'admin-server',
      brokers: (process.env.KAFKA_HOST ?? 'localhost:9092').split(','),
    }),
  ],
  controllers: [AdminPushNotificationController],
  providers: [AdminPushNotificationService],
})
export class AdminPushNotificationModule {}
