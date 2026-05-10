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
import { FoodStationService } from './food-station.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { GetFoodStationAllDto } from './dto/request/get-food-station-all.dto';
import { GetFoodStationAllResponseDto } from './dto/response/get-food-station-all.response.dto';
import { CreateFoodStationDto } from './dto/request/create-food-station.dto';
import { FoodStationEntity } from './entity/food-station.entity';
import { UpdateFoodStationDto } from './dto/request/update-food-station.dto';
import { CrawlingFoodStationDto } from './dto/request/crawlingFoodStation.dto';

@Controller('')
export class FoodStationController {
  constructor(private readonly foodStationService: FoodStationService) {}

  /**
   * 특정 식당의 일자 범위에 해당하는 코너 전체 조회
   */
  @Get('cafeteria/:idx/food-station/all')
  @Exception(400, 'invalid cafeteria idx')
  @Exception(404, 'cafeteria not found')
  @AdminAuth()
  public async getFoodStationAll(
    @Param('idx', ParseIntPipe) idx: number,
    @Query() dto: GetFoodStationAllDto,
  ): Promise<GetFoodStationAllResponseDto> {
    return this.foodStationService.getFoodStationAll(idx, dto);
  }

  /**
   * 특정 식당의 코너 생성
   */
  @Post('cafeteria/:idx/food-station')
  @Exception(400, 'invalid cafeteria idx')
  @Exception(404, 'cafeteria not found')
  @AdminAuth()
  public async createFoodStation(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: CreateFoodStationDto,
  ): Promise<FoodStationEntity> {
    return this.foodStationService.createFoodStation(idx, dto);
  }

  /**
   * 학식 자동으로 불러오기
   *
   * - 1: 인하대 학생식당
   * - 2: 인하대 교직원식당
   * - 3: 인하대 기숙사식당 (현재 크롤링 지원 X)
   * - 4: 인하공전 학생식당
   * - 5: 인하공전 교직원식당
   */
  @Post('cafeteria/:idx/food-station/crawling')
  @Exception(400, 'invalid cafeteria idx')
  @Exception(404, 'cafeteria not found')
  @AdminAuth()
  public async crawlingFoodStation(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: CrawlingFoodStationDto,
  ): Promise<FoodStationEntity[]> {
    return this.foodStationService.crawlingFoodStation(idx, dto);
  }

  /**
   * 특정 코너 수정
   */
  @Put('food-station/:idx')
  @Exception(400, 'invalid food station idx')
  @Exception(404, 'food station not found')
  @AdminAuth()
  public async updateFoodStationByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateFoodStationDto,
  ): Promise<void> {
    return this.foodStationService.updateFoodStationByIdx(idx, dto);
  }

  /**
   * 특정 코너 삭제
   */
  @Delete('food-station/:idx')
  @Exception(400, 'invalid food station idx')
  @Exception(404, 'food station not found')
  @AdminAuth()
  public async deleteFoodStationByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return this.foodStationService.deleteFoodStationByIdx(idx);
  }
}
