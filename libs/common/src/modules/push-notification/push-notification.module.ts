import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import pushNotificationConfig from './config/push-notification.config';
import { ApnsPushNotificationProvider } from './provider/apns/apns-push-notification.provider';
import { PushNotificationService } from './push-notification.service';

/**
 * 푸시 알림 모듈
 *
 * iOS: APNs (Apple Push Notification service)
 * Android: FCM (추후 지원 예정)
 *
 * @publicApi
 */
@Module({
  imports: [ConfigModule.forFeature(pushNotificationConfig)],
  providers: [ApnsPushNotificationProvider, PushNotificationService],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
