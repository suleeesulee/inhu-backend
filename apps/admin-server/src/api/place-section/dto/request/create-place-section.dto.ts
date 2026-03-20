import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePlaceSectionParameterDto } from './create-place-section-parameter.dto';

export class CreatePlaceSectionDto {
  /**
   * 섹션 제목
   *
   * @example "인기 맛집"
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  parameter: CreatePlaceSectionParameterDto;
}
