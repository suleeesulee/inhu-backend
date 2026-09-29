import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

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
  @Matches(/^[0-9A-F]{14}$/)
  uid: string;

  /**
   * NFC 쿨다운 시간 (초 단위)
   * - 미전달: 기존 설정 유지
   * - null: 서버 기본 쿨타임 적용
   * - 0: 쿨타임 미적용
   * - 1 이상: 입력한 시간만큼 쿨타임 적용
   *
   * @example 60
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cooldown?: number | null;
}
