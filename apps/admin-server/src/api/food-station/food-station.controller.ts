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

@Controller('')
export class FoodStationController {
  constructor(private readonly foodStationService: FoodStationService) {}

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
