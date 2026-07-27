import { IsString } from 'class-validator';

export class LoginDto {
  /**
   * 관리자 id
   *
   * @example "admin"
   */
  @IsString()
  id: string;

  /**
   * 관리자 비밀번호
   *
   * @example "1234"
   */
  @IsString()
  pw: string;
}
