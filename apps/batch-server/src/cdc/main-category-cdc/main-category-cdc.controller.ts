import { Controller } from '@nestjs/common';
import { MainCategoryCdcService } from './main-category-cdc.service';

@Controller()
export class MainCategoryCdcController {
  constructor(
    private readonly mainCategoryCdcService: MainCategoryCdcService,
  ) {}
}
