import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePlaceVisitByNfcDto {
  /**
   * 암호화된 PICC 데이터
   *
   * @example "45E23C3E01DD81C77695B3913ACC9593"
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9a-fA-F]+$/)
  picc_data: string;

  /**
   * SDM MAC
   *
   * @example "5B5123F57E673DA9"
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9a-fA-F]{16}$/)
  cmac: string;

  /**
   * 추가 암호화 데이터
   *
   * @example "5643892563214698"
   */
  @IsOptional()
  @IsString()
  @Matches(/^[0-9a-fA-F]*$/)
  enc?: string;
}
