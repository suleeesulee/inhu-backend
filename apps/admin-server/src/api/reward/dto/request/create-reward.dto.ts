import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRewardDto {
  /**
   * 리워드 이름
   *
   * @example "스타벅스 아메리카노 1잔"
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 리워드 이미지 경로
   *
   * @example "/images/rewards/starbucks_coffee.jpg"
   */
  @IsNotEmpty()
  @IsString()
  imagePath: string;
}
