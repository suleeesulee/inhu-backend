import { FreeTagCoreService } from '@libs/core/free-tag/free-tag-core.service';
import { Injectable } from '@nestjs/common';
import { GetFreeTagAllResponseDto } from './dto/response/get-free-tag-all-response.dto';
import { FreeTagEntity } from './entity/free-tag.entity';

@Injectable()
export class FreeTagService {
  constructor(private readonly freeTagCoreService: FreeTagCoreService) {}

  public async getFreeTagAll(): Promise<GetFreeTagAllResponseDto> {
    const freeTagList = await this.freeTagCoreService.getFreeTagAll();

    return {
      freeTagList: freeTagList.map((freeTag) =>
        FreeTagEntity.fromModel(freeTag),
      ),
    };
  }
}
