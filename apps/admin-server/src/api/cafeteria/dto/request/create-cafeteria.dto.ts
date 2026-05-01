import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCafeteriaDto {
  /**
   * 식당 이름
   * @example "인하대학교 학생식당"
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
