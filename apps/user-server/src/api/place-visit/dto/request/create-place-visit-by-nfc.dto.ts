import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
