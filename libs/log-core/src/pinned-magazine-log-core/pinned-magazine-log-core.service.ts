import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PinnedMagazineLogCoreRepository } from './pinned-magazine-log-core.repository';
import { CreateDimPinnedMagazineInput } from './inputs/create-dim-keyword.input';

@Injectable()
export class PinnedMagazineLogCoreService {
  constructor(
    private readonly keywordLogCoreRepository: PinnedMagazineLogCoreRepository,
  ) {}

  @Transactional()
  public async createDimPinnedMagazine(
    input: CreateDimPinnedMagazineInput,
    updatedAt: Date,
  ) {
    await this.keywordLogCoreRepository.insertDimPinnedMagazine({
      ...input,
      validFrom: updatedAt,
    });
  }
}
