import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreatePlaceSectionParameterDto } from './create-place-section-parameter.dto';
import { Type } from 'class-transformer';

export class CreatePlaceSectionDto {
  /**
   * 섹션 제목
   *
   * @example "인기 맛집"
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  @ValidateNested()
  @Type(() => CreatePlaceSectionParameterDto)
  parameter: CreatePlaceSectionParameterDto;
}
