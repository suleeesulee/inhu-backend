import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { MealOfferingService } from './meal-offering.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { CreateMealOfferingDto } from './dto/request/create-meal-offering.dto';
import { MealOfferingEntity } from './entity/meal-offering.entity';
import { UpdateMealOfferingDto } from './dto/request/update-meal-offering.dto';

@Controller()
export class MealOfferingController {
  constructor(private readonly mealOfferingService: MealOfferingService) {}

  /**
   * 특정 코너의 특정 날짜 학식 생성
   */
  @Post('/food-station/:foodStationIdx/meal-offering')
  @Exception(400, 'invalid food station idx')
  @Exception(404, 'food station not found')
  @Exception(409, 'meal offering already exists for the served date')
  @AdminAuth()
  public async createMealOffering(
    @Param('foodStationIdx', ParseIntPipe) foodStationIdx: number,
    @Body() dto: CreateMealOfferingDto,
  ): Promise<MealOfferingEntity> {
    return await this.mealOfferingService.createMealOffering(
      foodStationIdx,
      dto,
    );
  }

  /**
   * 학식 정보 수정
   */
  @Put('/meal-offering/:idx')
  @Exception(400, 'invalid meal offering idx')
  @Exception(404, 'meal offering not found')
  @AdminAuth()
  public async updateMealOfferingByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateMealOfferingDto,
  ): Promise<void> {
    return await this.mealOfferingService.updateMealOfferingByIdx(idx, dto);
  }

  /**
   * 학식 정보 삭제
   */
  @Delete('/meal-offering/:idx')
  @Exception(400, 'invalid meal offering idx')
  @Exception(404, 'meal offering not found')
  @AdminAuth()
  public async deleteMealOfferingByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.mealOfferingService.deleteMealOfferingByIdx(idx);
  }
}
