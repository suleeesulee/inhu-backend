import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DailyMemoService } from './daily-memo.service';
import { DailyMemoEntity } from './entity/daily-memo.entity';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetDailyMemoAllDto } from './dto/request/get-daily-memo-all.dto';
import { CreateDailyMemoDto } from './dto/request/create-daily-memo.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { UpdateDailyMemoDto } from './dto/request/update-daily-memo.dto';

@Controller()
export class DailyMemoController {
  constructor(private readonly dailyMemoService: DailyMemoService) {}

  @Get('/cafeteria/:idx/daily-memo/all')
  @AdminAuth()
  public async getDailyMemoAll(
    @Query() dto: GetDailyMemoAllDto,
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<DailyMemoEntity[]> {
    return await this.dailyMemoService.getDailyMemoAll(idx, dto);
  }

  @Post('/cafeteria/:idx/daily-memo')
  @Exception(400, 'invalid cafeteria idx or body')
  @AdminAuth()
  public async createDailyMemo(
    @Body() dto: CreateDailyMemoDto,
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<DailyMemoEntity> {
    return await this.dailyMemoService.createDailyMemo(idx, dto);
  }

  @Put('/daily-memo/:idx')
  @Exception(400, 'invalid daily memo idx or body')
  @Exception(404, 'daily memo does not exist')
  @AdminAuth()
  public async updateDailyMemoByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateDailyMemoDto,
  ): Promise<void> {
    return await this.dailyMemoService.updateDailyMemoByIdx(idx, dto);
  }

  @Delete('/daily-memo/:idx')
  @Exception(400, 'invalid daily memo idx')
  @Exception(404, 'daily memo does not exist')
  @AdminAuth()
  public async deleteDailyMemoByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.dailyMemoService.deleteDailyMemoByIdx(idx);
  }
}
