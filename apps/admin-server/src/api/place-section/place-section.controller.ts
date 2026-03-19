import {
  Body,
  Controller,
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

@Controller('place-section')
export class PlaceSectionController {
  constructor(private readonly placeSectionService: PlaceSectionService) {}

  @Get('/all')
  public async getPlaceSectionAll() {
    return await this.placeSectionService.getPlaceSectionAll();
  }

  @Post()
  public async createPlaceSection(
    @Body() dto: CreatePlaceSectionDto,
  ): Promise<PlaceSectionEntity> {
    return await this.placeSectionService.createPlaceSection(dto);
  }

  @Put('/:idx')
  public async updatePlaceSection(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdatePlaceSectionDto,
  ): Promise<void> {
    await this.placeSectionService.updatePlaceSection(idx, dto);
  }

  @Put('/:idx')
  public async deletePlaceSection(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.placeSectionService.deletePlaceSection(idx);
  }
}
