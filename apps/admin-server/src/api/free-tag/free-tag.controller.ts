import { Controller, Get } from '@nestjs/common';
import { FreeTagService } from './free-tag.service';
import { GetFreeTagAllResponseDto } from './dto/response/get-free-tag-all-response.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';

@Controller('free-tag')
export class FreeTagController {
  constructor(private readonly freeTagService: FreeTagService) {}

  @Get('/all')
  @AdminAuth()
  async getFreeTagAll(): Promise<GetFreeTagAllResponseDto> {
    return await this.freeTagService.getFreeTagAll();
  }
}
