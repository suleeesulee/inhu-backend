export type SendPushNotificationInput = {
  token: string;
  platform: 'ios' | 'android';
  title: string;
  body: string;
  data?: Record<string, string>;
};
