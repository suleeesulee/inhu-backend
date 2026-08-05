import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateNfcDto {
  /**
   * NFC 밥그릇 점수
   *
   * @example 3
   */
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  score: number;

  /**
   * NFC 토큰 해시
   *
   * @example "hashed_token"
   */
  @IsNotEmpty()
  @IsString()
  tokenHash: string;
}
