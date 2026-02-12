import { Injectable } from '@nestjs/common';
import { MainCategoryLogCoreRepository } from './main-category-log-core.repository';

@Injectable()
export class MainCategoryLogCoreService {
  constructor(
    private readonly mainCategoryLogCoreRepository: MainCategoryLogCoreRepository,
  ) {}
}
