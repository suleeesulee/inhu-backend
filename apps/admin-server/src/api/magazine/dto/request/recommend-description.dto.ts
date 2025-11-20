import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RecommendDescriptionDto {
  /**
   * 매거진 제목
   *
   * @example "고물가 시대에서 살아남기"
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * 매거진 내용
   *
   * @example "가성비 식당 리스트를 소개합니다.\n첫 번째 식당은 ... "
   */
  @IsString()
  @IsNotEmpty()
  content: string;

  /**
   * 썸네일 이미지 경로
   *
   * @example "https://inhu-files.s3.ap-northeast-2.amazonaws.com/magazine/7c218cf5-b04b-4a86-a027-ebffe4f4f64d.webp"
   */
  @IsUrl()
  @IsNotEmpty()
  thumbnailImagePath: string;
}
