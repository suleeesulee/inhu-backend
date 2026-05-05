import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GetFoodStationDto } from './dto/request/get-food-station.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { GetFoodStationResponseDto } from './dto/response/get-food-station.response.dto';
import { FoodStationService } from './food-station.service';
import { CafeteriaEntity } from './entity/cafeteria.entity';

@Controller()
export class FoodStationController {
  constructor(private readonly foodStationService: FoodStationService) {}

  /**
   * 식당 목록 전체 불러오기
   */
  @Get('/cafeteria/all')
  public async getCafeteriaAll(): Promise<CafeteriaEntity[]> {
    return await this.foodStationService.getCafeteriaAll();
  }

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
