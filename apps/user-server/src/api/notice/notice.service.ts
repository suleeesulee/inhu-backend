import { Injectable, NotFoundException } from '@nestjs/common';
import { NoticeCoreService } from '@libs/core/notice/notice-core.service';
import { NoticeEntity } from './entity/notice.entity';
import { NoticeOverviewEntity } from './entity/notice-overview.entity';
import { GetAllNoticeDto } from './dto/request/get-all-notice.dto';
import { GetAllNoticeResponseDto } from './dto/response/get-all-notice.response.dto';

const PAGE_SIZE = 10;

@Injectable()
export class NoticeService {
  constructor(private readonly noticeCoreService: NoticeCoreService) {}

  public async getNoticeAll(
    dto: GetAllNoticeDto,
  ): Promise<GetAllNoticeResponseDto> {
    const input = {
      take: PAGE_SIZE,
      skip: (dto.page - 1) * PAGE_SIZE,
    };

    return {
      noticeList: (await this.noticeCoreService.getNoticeAll(input)).map(
        NoticeOverviewEntity.fromModel,
      ),
      count: await this.noticeCoreService.getNoticeCount(),
    };
  }

  public async getNoticeByIdx(idx: number): Promise<NoticeEntity> {
    const notice = await this.noticeCoreService.getNoticeByIdx(idx);

    if (!notice) {
      throw new NotFoundException(`Cannot find notice idx: ${idx}`);
    }

    return NoticeEntity.fromModel(notice);
  }
}
