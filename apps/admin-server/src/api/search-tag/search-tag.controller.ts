import { Controller, Get } from '@nestjs/common';
import { SearchTagService } from './search-tag.service';
import { GetSearchTagAllResponseDto } from './dto/response/get-search-tag-all-response.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';

@Controller('search-tag')
export class SearchTagController {
  constructor(private readonly searchTagService: SearchTagService) {}

  @Get('/all')
  @AdminAuth()
  async getSearchTagAll(): Promise<GetSearchTagAllResponseDto> {
    return await this.searchTagService.getSearchTagAll();
  }
}
