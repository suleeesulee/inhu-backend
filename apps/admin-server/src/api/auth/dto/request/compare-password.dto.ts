import { IsString, MaxLength, MinLength } from 'class-validator';

export class ComparePasswordDto {
  @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  pw: string;
}
