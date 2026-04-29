import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
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
import { CombinedSectionService } from './combined-section.service';
import {
  GetCombinedSectionAllResponseDto,
  MagazineSectionItem,
  PlaceSectionItem,
} from './dto/response/get-combined-section-all.response.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateMagazineSectionDto } from './dto/request/create-magazine-section.dto';
import { MagazineSectionEntity } from './entity/magazine-section.entity';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { UpdateMagazineSectionDto } from './dto/request/update-magazine-section.dto';
import { UpdateMagazineSectionSortOrderDto } from './dto/request/update-magazine-section-sort-order.dto';
import { CreatePlaceSectionDto } from './dto/request/create-place-section.dto';
import { PlaceSectionEntity } from './entity/place-section.entity';
import { UpdatePlaceSectionDto } from './dto/request/update-place-section.dto';
import { UpdatePlaceSectionSortOrderDto } from './dto/request/update-place-section-sort-order.dto';

@Controller('section')
@ApiTags('Section')
export class CombinedSectionController {
  constructor(
    private readonly combinedSectionService: CombinedSectionService,
  ) {}

  /**
   * magazine section과 place section을 모두 조회하는 API
   */
  @Get('/all')
  @AdminAuth()
  @ApiExtraModels(PlaceSectionItem, MagazineSectionItem)
  public async getCombinedSectionAll(): Promise<GetCombinedSectionAllResponseDto> {
    return await this.combinedSectionService.getCombinedSectionAll();
  }

  // ------------------- Admin API for Magazine Section ------------------ -

  /**
   * magazine section 생성
   */
  @Post()
  @AdminAuth()
  public async createMagazineSection(
    @Body() dto: CreateMagazineSectionDto,
  ): Promise<MagazineSectionEntity> {
    return await this.combinedSectionService.createMagazineSection(dto);
  }

  /**
   * magazine section 수정
   */
  @Put('/:idx')
  @Exception(404, 'Magazine section not found')
  @AdminAuth()
  public async updateMagazineSection(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateMagazineSectionDto,
  ): Promise<void> {
    await this.combinedSectionService.updateMagazineSection(idx, dto);
  }

  /**
   * magazine section 순서 수정
   */
  @AdminAuth()
  @Exception(400, 'Invalid sort order')
  @Exception(404, 'Magazine section does not exist')
  @Put('/:idx/sort-order')
  public async updateMagazineSectionSortOrder(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateMagazineSectionSortOrderDto,
  ): Promise<void> {
    return await this.combinedSectionService.updateMagazineSectionSortOrder(
      idx,
      dto,
    );
  }

  /**
   * magazine section 삭제
   */
  @Delete('/:idx')
  @Exception(404, 'Magazine section not found')
  @AdminAuth()
  public async deleteMagazineSection(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.combinedSectionService.deleteMagazineSection(idx);
  }

  // ------------------- Admin API for Place Section ------------------ -

  /**
   * place section 생성
   */
  @Post()
  @AdminAuth()
  public async createPlaceSection(
    @Body() dto: CreatePlaceSectionDto,
  ): Promise<PlaceSectionEntity> {
    return await this.combinedSectionService.createPlaceSection(dto);
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
    await this.combinedSectionService.updatePlaceSection(idx, dto);
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
    return await this.combinedSectionService.updatePlaceSectionSortOrder(
      idx,
      dto,
    );
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
    await this.combinedSectionService.deletePlaceSection(idx);
  }
}
