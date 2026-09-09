import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationCampaignDto {
  /**
   * 알림 제목
   *
   * @example "서비스 점검 안내"
   */
  @IsString()
  @IsNotEmpty()
  public title: string;

  /**
   * 알림 내용
   *
   * @example "오늘 23시부터 서비스 점검이 진행됩니다."
   */
  @IsString()
  @IsNotEmpty()
  public content: string;

  /**
   * 알림 클릭 시 이동할 페이지 타입
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  public pageType: number;
}
