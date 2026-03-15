import { IsString } from 'class-validator';

export class DeleteUserDto {
  /**
   * token type이 포함된 refresh token
   *
   * @example "Bearer this.is.token"
   */
  @IsString()
  public refreshTokenWithType: string;
}
