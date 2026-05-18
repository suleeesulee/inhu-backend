import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationCodeDto {
  /**
   * 인증 코드를 받을 이메일 주소
   *
   * @example "suin7473@inha.edu"
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
