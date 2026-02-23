import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CheckAdminIdDuplicateDto {
  /**
   * @example "hong1234"
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  id: string;
}
