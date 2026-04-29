import { IsNotEmpty, IsString } from 'class-validator';
import { CreateMagazineSectionParameterDto } from './create-magazine-section-parameter.dto';

export class CreateMagazineSectionDto {
  /**
   * 섹션 제목
   *
   * @example "인기 맛집"
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  parameter: CreateMagazineSectionParameterDto;
}
