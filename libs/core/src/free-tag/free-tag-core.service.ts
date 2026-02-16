import { Injectable } from '@nestjs/common';
import { FreeTagCoreRepository } from './free-tag-core.repository';

@Injectable()
export class FreeTagCoreService {
  constructor(private readonly freeTagCoreRepository: FreeTagCoreRepository) {}
}
