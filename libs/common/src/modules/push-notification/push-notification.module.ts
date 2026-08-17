import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import pushNotificationConfig from './config/push-notification.config';
import { ApnsPushNotificationProvider } from './provider/apns/apns-push-notification.provider';
import { FcmPushNotificationProvider } from './provider/fcm/fcm-push-notification.provider';
import { PushNotificationService } from './push-notification.service';

/**
 * 푸시 알림 모듈
 *
 * iOS: APNs (Apple Push Notification service)
 * Android: FCM (Firebase Cloud Messaging)
 *
 * @publicApi
 */
@Module({
  imports: [ConfigModule.forFeature(pushNotificationConfig)],
  providers: [
    ApnsPushNotificationProvider,
    FcmPushNotificationProvider,
    PushNotificationService,
  ],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
