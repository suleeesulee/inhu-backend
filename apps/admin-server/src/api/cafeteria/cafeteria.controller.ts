import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CafeteriaService } from './cafeteria.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { CafeteriaEntity } from './entity/cafeteria.entity';
import { CreateCafeteriaDto } from './dto/request/create-cafeteria.dto';
import { CopyCafeteriaDataDto } from './dto/request/copy-cafeteria-data.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('cafeteria')
export class CafeteriaController {
  constructor(private readonly cafeteriaService: CafeteriaService) {}

  /**
   * 식당 전체 조회
   */
  @AdminAuth()
  @Get('/all')
  public async getCafeteriaAll(): Promise<CafeteriaEntity[]> {
    return await this.cafeteriaService.getCafeteriaAll();
  }

  /**
   * 식당 생성
   */
  @AdminAuth()
  @Post()
  public async createCafeteria(
    @Body() dto: CreateCafeteriaDto,
  ): Promise<CafeteriaEntity> {
    return await this.cafeteriaService.createCafeteria(dto);
  }

  /**
   * 식당 수정
   */
  @AdminAuth()
  @Exception(400, 'Invalid idx or request body')
  @Exception(404, 'Cafeteria does not exist')
  @Put('/:idx')
  public async updateCafeteriaByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: CreateCafeteriaDto,
  ): Promise<void> {
    return await this.cafeteriaService.updateCafeteriaByIdx(idx, dto);
  }

  /**
   * 식당 삭제
   */
  @AdminAuth()
  @Exception(400, 'Invalid idx')
  @Exception(404, 'Cafeteria does not exist')
  @Delete('/:idx')
  public async deleteCafeteriaByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.cafeteriaService.deleteCafeteriaByIdx(idx);
  }

  /**
   * 특정 식당의 코너와 메뉴 그리고 메모 데이터 복사해서 추가하기 (이전 데이터를 삭제하지는 않음)
   */
  @AdminAuth()
  @Exception(400, 'Invalid idx')
  @Exception(404, 'Cafeteria does not exist')
  @Exception(409, 'Already exist some data in cafeteria idx')
  @Post('/:copyToCafeteriaIdx/copy')
  public async copyData(
    @Param('copyToCafeteriaIdx', ParseIntPipe) copyToCafeteriaIdx: number,
    @Body() dto: CopyCafeteriaDataDto,
  ): Promise<void> {
    return await this.cafeteriaService.copyData(copyToCafeteriaIdx, dto);
  }
}
