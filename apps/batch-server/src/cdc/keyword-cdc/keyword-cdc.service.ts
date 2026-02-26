import { KeywordLogCoreService } from '@libs/log-core/keyword-log-core/keyword-log-core.service';
import { Injectable } from '@nestjs/common';
import { KeywordTb } from './events/keyword-tb.event';

@Injectable()
export class KeywordCdcService {
  constructor(private readonly keywordLogCoreService: KeywordLogCoreService) {}

  public async createDimKeyword(keyword: KeywordTb, time: Date) {
    await this.keywordLogCoreService.createDimKeyword(
      {
        idx: keyword.idx,
        content: keyword.content,
        deletedAt: keyword.deleted_at ? new Date(keyword.deleted_at) : null,
        registeredAt: new Date(keyword.created_at),
      },
      time,
    );
  }
}
