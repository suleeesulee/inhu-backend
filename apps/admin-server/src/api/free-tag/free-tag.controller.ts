import { Controller } from '@nestjs/common';
import { FreeTagService } from './free-tag.service';

@Controller('free-tag')
export class FreeTagController {
  constructor(private readonly freeTagService: FreeTagService) {}
}
