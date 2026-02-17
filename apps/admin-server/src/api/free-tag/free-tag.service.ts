import { FreeTagCoreService } from '@libs/core/free-tag/free-tag-core.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FreeTagService {
  constructor(private readonly freeTagCoreService: FreeTagCoreService) {}
}
