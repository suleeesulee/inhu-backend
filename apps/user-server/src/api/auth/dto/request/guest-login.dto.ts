import { IsNotEmpty, IsString } from 'class-validator';

export class GuestLoginDto {
  @IsNotEmpty()
  @IsString()
  pw: string;
}
