import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

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
   * NFC UID
   *
   * @example "04DE5F1EACC040"
   */
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  uid: string;
}
