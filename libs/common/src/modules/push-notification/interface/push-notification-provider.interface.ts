export type PushNotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

/**
 * 플랫폼별 푸시 알림 발송 프로바이더 인터페이스
 *
 * iOS: ApnsPushNotificationProvider
 * Android: (추후 FcmPushNotificationProvider 추가 예정)
 */
export abstract class IPushNotificationProvider {
  abstract send(
    token: string,
    payload: PushNotificationPayload,
  ): Promise<void>;
}
