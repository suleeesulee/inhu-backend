import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoticeDto {
  /**
   * 공지사항 제목
   *
   * @example "서비스 점검 안내"
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * 공지사항 내용
   *
   * @example "2025년 1월 1일 00:00 ~ 06:00 서비스 점검이 있습니다."
   */
  @IsString()
  @IsNotEmpty()
  content: string;
}
