import { Query, Controller, Get } from '@nestjs/common';
import { PlaceService } from './place.service';
import { User } from '@user/common/decorator/user.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { GetAllPlaceOverviewResponseDto } from './dto/response/get-all-place-overview-response.dto';
import { LoginUser } from '@user/common/types/LoginUser';
import { GetAllPlaceOverviewV2Dto } from './dto/request/get-all-place-overview-v2.dto';

@Controller()
export class PlaceV2Controller {
  constructor(private placeService: PlaceService) {}

  /**
   * 모든 place 개요 가져오기
   */
  @Get('/v2/place/all')
  @Exception(400, 'Invalid page number or orderBy')
  async getAllPlaceOverviewV2(
    @Query() dto: GetAllPlaceOverviewV2Dto,
    @User() loginUser?: LoginUser,
  ): Promise<GetAllPlaceOverviewResponseDto> {
    return await this.placeService.getPlaceOverviewAllV2(dto, loginUser?.idx);
  }
}
