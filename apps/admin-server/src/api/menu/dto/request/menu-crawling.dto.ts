import { IsNotEmpty, IsUrl } from 'class-validator';

export class MenuCrawlingDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
