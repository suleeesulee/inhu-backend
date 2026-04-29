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
import { PlaceSectionService } from './place-section.service';
import { CreatePlaceSectionDto } from './dto/request/create-place-section.dto';
import { PlaceSectionEntity } from './entity/place-section.entity';
import { UpdatePlaceSectionDto } from './dto/request/update-place-section.dto';
import { GetPlaceSectionAllResponseDto } from './dto/response/get-place-section-all.response.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { UpdatePlaceSectionSortOrderDto } from './dto/request/update-place-section-sort-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('place-section')
@ApiTags('Section')
export class PlaceSectionController {
  constructor(private readonly placeSectionService: PlaceSectionService) {}

  /**
   * place section 생성
   */
  @Post()
  @AdminAuth()
  public async createPlaceSection(
    @Body() dto: CreatePlaceSectionDto,
  ): Promise<PlaceSectionEntity> {
    return await this.placeSectionService.createPlaceSection(dto);
  }

  /**
   * place section 수정
   */
  @Put('/:idx')
  @Exception(404, 'Place section not found')
  @AdminAuth()
  public async updatePlaceSection(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdatePlaceSectionDto,
  ): Promise<void> {
    await this.placeSectionService.updatePlaceSection(idx, dto);
  }

  /**
   * place section 순서 수정
   */
  @AdminAuth()
  @Exception(400, 'Invalid sort order')
  @Exception(404, 'Place section does not exist')
  @Put('/:idx/sort-order')
  public async updatePlaceSectionSortOrder(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdatePlaceSectionSortOrderDto,
  ): Promise<void> {
    return await this.placeSectionService.updatePlaceSectionSortOrder(idx, dto);
  }

  /**
   * place section 삭제
   */
  @Delete('/:idx')
  @Exception(404, 'Place section not found')
  @AdminAuth()
  public async deletePlaceSection(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.placeSectionService.deletePlaceSection(idx);
  }
}
