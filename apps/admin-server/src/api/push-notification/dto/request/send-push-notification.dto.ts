import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendPushNotificationDto {
  /**
   * 푸시 알림을 받을 user idx
   */
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  userIdx: number;

  /**
   * 디바이스 플랫폼
   */
  @IsNotEmpty()
  @IsString()
  @IsIn(['ios', 'android'])
  platform: 'ios' | 'android';

  /**
   * 푸시 알림 제목
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  /**
   * 푸시 알림 본문
   */
  @IsNotEmpty()
  @IsString()
  body: string;

  /**
   * 앱에 전달할 추가 데이터
   */
  @IsObject()
  @IsOptional()
  data?: Record<string, string>;
}
