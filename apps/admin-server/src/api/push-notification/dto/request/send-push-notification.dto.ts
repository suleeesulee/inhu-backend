import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class SendPushNotificationDto {
  /**
   * 푸시 알림을 받을 디바이스 토큰
   */
  @IsString()
  token: string;

  /**
   * 디바이스 플랫폼
   */
  @IsString()
  @IsIn(['ios', 'android'])
  platform: 'ios' | 'android';

  /**
   * 푸시 알림 제목
   */
  @IsString()
  title: string;

  /**
   * 푸시 알림 본문
   */
  @IsString()
  body: string;

  /**
   * 앱에 전달할 추가 데이터
   */
  @IsObject()
  @IsOptional()
  data?: Record<string, string>;
}
