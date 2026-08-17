import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeEntity } from './entity/notice.entity';
import { GetAllNoticeDto } from './dto/request/get-all-notice.dto';
import { GetAllNoticeResponseDto } from './dto/response/get-all-notice.response.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  /**
   * 공지사항 목록 조회
   */
  @Get('/all')
  @Exception(400, 'Invalid notice request')
  public async getNoticeAll(
    @Query() dto: GetAllNoticeDto,
  ): Promise<GetAllNoticeResponseDto> {
    return await this.noticeService.getNoticeAll(dto);
  }

  /**
   * 공지사항 자세히보기
   */
  @Get('/:idx')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find notice')
  public async getNoticeByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<NoticeEntity> {
    return await this.noticeService.getNoticeByIdx(idx);
  }
}
