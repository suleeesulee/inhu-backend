import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDailyMemoDto {
  /**
   * 날짜 (YYYY-MM-DD)
   *
   * @example 2026-04-20
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  date: string;

  /**
   * 메모 내용
   *
   * @example 오늘은 맛있는 점심이 나왔어요!
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  content: string;
}
