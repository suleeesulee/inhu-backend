import { SearchTagCoreService } from '@libs/core/search-tag/search-tag-core.service';
import { Injectable } from '@nestjs/common';
import { GetSearchTagAllResponseDto } from './dto/response/get-search-tag-all-response.dto';
import { SearchTagEntity } from './entity/search-tag.entity';

@Injectable()
export class SearchTagService {
  constructor(private readonly searchTagCoreService: SearchTagCoreService) {}

  public async getSearchTagAll(): Promise<GetSearchTagAllResponseDto> {
    const searchTagList = await this.searchTagCoreService.getSearchTagAll();

    return {
      searchTagList: searchTagList.map((searchTag) =>
        SearchTagEntity.fromModel(searchTag),
      ),
    };
  }
}
