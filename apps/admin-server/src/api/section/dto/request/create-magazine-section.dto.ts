import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateMagazineSectionParameterDto } from './create-magazine-section-parameter.dto';
import { Type } from 'class-transformer';

export class CreateMagazineSectionDto {
  /**
   * 섹션 제목
   *
   * @example "인기 맛집"
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  @ValidateNested()
  @Type(() => CreateMagazineSectionParameterDto)
  parameter: CreateMagazineSectionParameterDto;
}
