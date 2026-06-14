import { IsString } from 'class-validator';

export class LoginDto {
  /**
   * 관리자 id
   *
   * @example "12345"
   */
  @IsString()
  id: string;

  /**
   * 관리자 비밀번호
   *
   * @example "12345"
   */
  @IsString()
  pw: string;
}
