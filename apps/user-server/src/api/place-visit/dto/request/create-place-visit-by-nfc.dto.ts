import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePlaceVisitByNfcDto {
  /**
   * 암호화된 PICC 데이터
   *
   * @example "45E23C3E01DD81C77695B3913ACC9593"
   */
  @IsNotEmpty()
  @IsString()
  picc_data: string;

  /**
   * 추가 암호화 데이터
   *
   * @example "5643892563214698"
   */
  @IsOptional()
  @IsString()
  enc?: string;

  /**
   * SDM MAC
   *
   * @example "5B5123F57E673DA9"
   */
  @IsNotEmpty()
  @IsString()
  cmac: string;

  /**
   * 방문 인증 위도
   *
   * @example 37.4508371
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number | null;

  /**
   * 방문 인증 경도
   *
   * @example 126.6531324
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number | null;
}
