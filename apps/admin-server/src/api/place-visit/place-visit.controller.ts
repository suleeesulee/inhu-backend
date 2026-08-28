import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { GetPlaceVisitAllDto } from './dto/request/get-place-visit-all.dto';
import { GetPlaceVisitAllResponseDto } from './dto/response/get-place-visit-all.response.dto';
import { PlaceVisitService } from './place-visit.service';

@Controller('place-visit')
export class PlaceVisitController {
  constructor(private readonly placeVisitService: PlaceVisitService) {}

  /**
   * 방문 인증 전체 조회
   */
  @Get('/all')
  @AdminAuth()
  @Exception(400, 'Invalid request data')
  @Exception(404, 'User not found')
  public async getPlaceVisitAll(
    @Query() dto: GetPlaceVisitAllDto,
  ): Promise<GetPlaceVisitAllResponseDto> {
    return await this.placeVisitService.getPlaceVisitAll(dto);
  }

  /**
   * 특정 방문 인증 삭제
   */
  @Delete('/:id')
  @AdminAuth()
  @Exception(400, 'Invalid place visit id')
  @Exception(404, 'Place visit not found')
  public async deletePlaceVisitById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.placeVisitService.deletePlaceVisitById(id);
  }
}
