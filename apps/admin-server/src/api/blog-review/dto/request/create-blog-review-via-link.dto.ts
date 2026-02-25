import { IsUrl } from 'class-validator';

export class CreateBlogReviewViaLinkDto {
  @IsUrl()
  url: string;
}
