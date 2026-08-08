import { PlaceVisitCoreService } from '@libs/core/place-visit/place-visit-core.service';
import { Injectable } from '@nestjs/common';
import { GetPlaceVisitAllDto } from './dto/request/get-place-visit-all.dto';
import { GetPlaceVisitAllResponseDto } from './dto/response/get-place-visit-all.response.dto';
import { PlaceVisitEntity } from './entity/place-visit.entity';

@Injectable()
export class PlaceVisitService {
  constructor(private readonly placeVisitCoreService: PlaceVisitCoreService) {}

  public async getPlaceVisitAllByUserIdx(
    dto: GetPlaceVisitAllDto,
    userIdx: number,
  ): Promise<GetPlaceVisitAllResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;

    return {
      placeVisitList: (
        await this.placeVisitCoreService.getPlaceVisitAllByUserIdx(userIdx, {
          take: pageSize,
          skip,
        })
      ).map(PlaceVisitEntity.fromModel),
    };
  }
}
