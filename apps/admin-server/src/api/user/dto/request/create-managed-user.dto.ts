import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateManagedUserDto {
  /**
   * 사용자 닉네임
   *
   * @example "heeju"
   */
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  nickname: string;

  /**
   * 프로필 이미지 경로
   *
   * @example "/profile/1234c567-89d7-012c-34f0-56789a01a234-cat.jpg"
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profileImagePath: string | null;
}
