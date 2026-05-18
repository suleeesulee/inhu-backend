import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyCodeDto {
  /**
   * 인증 번호
   */
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}
