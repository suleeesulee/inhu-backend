import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeEntity } from './entity/notice.entity';
import { NoticeOverviewEntity } from './entity/notice-overview.entity';
import { GetAllNoticeDto } from './dto/request/get-all-notice.dto';
import { GetAllNoticeResponseDto } from './dto/response/get-all-notice.response.dto';
import { CreateNoticeDto } from './dto/request/create-notice.dto';
import { UpdateNoticeByIdxDto } from './dto/request/update-notice-by-idx.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { AdminRole } from '../auth/admin-role.enum';
import { Admin } from '@admin/common/decorator/admin.decorator';
import { LoginAdmin } from '@admin/common/types/login-admin';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  /**
   * 공지사항 목록 조회
   */
  @AdminAuth(AdminRole.Admin)
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
  @AdminAuth(AdminRole.Admin)
  @Get('/:idx')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find notice')
  public async getNoticeByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<NoticeEntity> {
    return await this.noticeService.getNoticeByIdx(idx);
  }

  /**
   * 공지사항 추가
   */
  @AdminAuth(AdminRole.Admin)
  @Post()
  @Exception(400, 'Invalid create notice request')
  public async createNotice(
    @Body() dto: CreateNoticeDto,
    @Admin() admin: LoginAdmin,
  ): Promise<NoticeEntity> {
    return await this.noticeService.createNotice(dto, admin);
  }

  /**
   * 공지사항 수정
   */
  @AdminAuth(AdminRole.Admin)
  @Put('/:idx')
  @Exception(400, 'Invalid notice idx')
  @Exception(404, 'Notice not found')
  @HttpCode(200)
  public async updateNoticeByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateNoticeByIdxDto,
  ): Promise<void> {
    await this.noticeService.updateNoticeByIdx(idx, dto);
  }

  /**
   * 공지사항 삭제
   */
  @AdminAuth(AdminRole.Admin)
  @Delete('/:idx')
  @Exception(400, 'Invalid notice idx')
  @Exception(404, 'Notice not found')
  public async deleteNoticeByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.noticeService.deleteNoticeByIdx(idx);
  }
}
