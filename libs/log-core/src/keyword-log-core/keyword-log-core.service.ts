import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { KeywordLogCoreRepository } from './keyword-log-core.repository';
import { CreateDimKeywordInput } from './inputs/create-dim-keyword.input';

@Injectable()
export class KeywordLogCoreService {
  constructor(
    private readonly keywordLogCoreRepository: KeywordLogCoreRepository,
  ) {}

  @Transactional()
  public async createDimKeyword(input: CreateDimKeywordInput, updatedAt: Date) {
    await this.keywordLogCoreRepository.insertDimKeyword({
      ...input,
      validFrom: updatedAt,
    });
  }
}
