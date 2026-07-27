import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminAccountDto {
  /**
   * @example "홍길동"
   */
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  nickname?: string;

  /**
   * @example "hong1234"
   */
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  id?: string;

  /**
   * @example "password1234"
   */
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  pw?: string;

  /**
   * 관리자 권한 (SUPER_ADMIN, ADMIN, MAGAZINE_ADMIN)
   */
  @IsNotEmpty()
  @IsEnumValue(AdminRole)
  role: AdminRole;
}
