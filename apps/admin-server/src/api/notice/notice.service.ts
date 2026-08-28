import { Injectable, NotFoundException } from '@nestjs/common';
import { NoticeCoreService } from '@libs/core/notice/notice-core.service';
import { NoticeEntity } from './entity/notice.entity';
import { NoticeOverviewEntity } from './entity/notice-overview.entity';
import { GetAllNoticeResponseDto } from './dto/response/get-all-notice.response.dto';
import { GetAllNoticeDto } from './dto/request/get-all-notice.dto';
import { CreateNoticeDto } from './dto/request/create-notice.dto';
import { UpdateNoticeByIdxDto } from './dto/request/update-notice-by-idx.dto';
import { NoticeNotFoundException } from './exception/NoticeNotFoundException';
import { LoginAdmin } from '@admin/common/types/login-admin';

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
      throw new NoticeNotFoundException(`Cannot find notice idx: ${idx}`);
    }

    return NoticeEntity.fromModel(notice);
  }

  public async createNotice(
    dto: CreateNoticeDto,
    admin: LoginAdmin,
  ): Promise<NoticeEntity> {
    return NoticeEntity.fromModel(
      await this.noticeCoreService.createNotice({
        authorIdx: admin.idx,
        title: dto.title,
        content: dto.content,
      }),
    );
  }

  public async updateNoticeByIdx(
    idx: number,
    dto: UpdateNoticeByIdxDto,
  ): Promise<void> {
    const notice = await this.noticeCoreService.getNoticeByIdx(idx);

    if (!notice) {
      throw new NoticeNotFoundException(`Cannot find notice idx: ${idx}`);
    }

    await this.noticeCoreService.updateNoticeByIdx(idx, {
      title: dto.title,
      content: dto.content,
    });
  }

  public async deleteNoticeByIdx(idx: number): Promise<void> {
    const notice = await this.noticeCoreService.getNoticeByIdx(idx);

    if (!notice) {
      throw new NoticeNotFoundException(`Cannot find notice idx: ${idx}`);
    }

    await this.noticeCoreService.deleteNoticeByIdx(idx);
  }
}
