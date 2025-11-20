import { IsNotEmpty, IsString } from 'class-validator';

export class MenuCrawlingDto {
  /**
   * 크롤링할 네이버 플레이스의 고유 식별자
   *
   * @example "33928724"
   */
  @IsNotEmpty()
  @IsString()
  placeIdx: string;
}
