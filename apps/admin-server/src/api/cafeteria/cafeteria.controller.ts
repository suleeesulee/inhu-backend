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
  @Delete('/:idx')
  public async deleteCafeteriaByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.cafeteriaService.deleteCafeteriaByIdx(idx);
  }
}
