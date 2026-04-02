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
import { MagazineSectionService } from './magazine-section.service';
import { CreateMagazineSectionDto } from './dto/request/create-magazine-section.dto';
import { MagazineSectionEntity } from './entity/magazine-section.entity';
import { UpdateMagazineSectionDto } from './dto/request/update-magazine-section.dto';
import { GetMagazineSectionAllResponseDto } from './dto/response/get-magazine-section-all.response.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('place-section')
export class MagazineSectionController {
  constructor(private readonly placeSectionService: MagazineSectionService) {}

  @Get('/all')
  @AdminAuth()
  public async getMagazineSectionAll(): Promise<GetMagazineSectionAllResponseDto> {
    return await this.placeSectionService.getMagazineSectionAll();
  }

  @Post()
  @AdminAuth()
  public async createMagazineSection(
    @Body() dto: CreateMagazineSectionDto,
  ): Promise<MagazineSectionEntity> {
    return await this.placeSectionService.createMagazineSection(dto);
  }

  @Put('/:idx')
  @Exception(404, 'Magazine section not found')
  @AdminAuth()
  public async updateMagazineSection(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateMagazineSectionDto,
  ): Promise<void> {
    await this.placeSectionService.updateMagazineSection(idx, dto);
  }

  @Delete('/:idx')
  @Exception(404, 'Magazine section not found')
  @AdminAuth()
  public async deleteMagazineSection(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.placeSectionService.deleteMagazineSection(idx);
  }
}
