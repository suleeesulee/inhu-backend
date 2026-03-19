import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePlaceSectionParameterDto } from './create-place-section-parameter.dto';

export class CreatePlaceSectionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  parameter: CreatePlaceSectionParameterDto;
}
