import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GetFoodStationDto } from './dto/request/get-food-station.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { GetFoodStationResponseDto } from './dto/response/get-food-station.response.dto';
import { FoodStationService } from './food-station.service';

@Controller()
export class FoodStationController {
  constructor(private readonly foodStationService: FoodStationService) {}

  /**
   * 특정 식당 특정 날짜 코너 리스트 조회
   */
  @Get('/cafeteria/:idx/food-station')
  @Exception(400, 'invalid request')
  @Exception(404, 'cafeteria not found')
  public async getFoodStation(
    @Param('idx', ParseIntPipe) idx: number,
    @Query() dto: GetFoodStationDto,
  ): Promise<GetFoodStationResponseDto> {
    return await this.foodStationService.getFoodStation(idx, dto);
  }
}
