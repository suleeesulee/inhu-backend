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

@Controller('place-section')
export class PlaceSectionController {
  constructor(private readonly placeSectionService: PlaceSectionService) {}

  @Get('/all')
  @AdminAuth()
  public async getPlaceSectionAll(): Promise<GetPlaceSectionAllResponseDto> {
    return await this.placeSectionService.getPlaceSectionAll();
  }

  @Post()
  @AdminAuth()
  public async createPlaceSection(
    @Body() dto: CreatePlaceSectionDto,
  ): Promise<PlaceSectionEntity> {
    return await this.placeSectionService.createPlaceSection(dto);
  }

  @Put('/:idx')
  @Exception(404, 'Place section not found')
  @AdminAuth()
  public async updatePlaceSection(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdatePlaceSectionDto,
  ): Promise<void> {
    await this.placeSectionService.updatePlaceSection(idx, dto);
  }

  @Delete('/:idx')
  @Exception(404, 'Place section not found')
  @AdminAuth()
  public async deletePlaceSection(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.placeSectionService.deletePlaceSection(idx);
  }
}
