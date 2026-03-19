import { PlaceSectionCoreService } from '@libs/core/place-section/place-section-core.service';
import { Injectable } from '@nestjs/common';
import { PlaceSectionEntity } from './entity/place-section.entity';
import { GetPlaceSectionAllResponseDto } from './dto/response/get-place-section-all.response.dto';

@Injectable()
export class PlaceSectionService {
  constructor(
    private readonly placeSectionCoreService: PlaceSectionCoreService,
  ) {}

  public async getPlaceSectionAll(): Promise<GetPlaceSectionAllResponseDto> {
    return {
      placeSectionEntityList: (
        await this.placeSectionCoreService.getPlaceSectionAll()
      ).map(PlaceSectionEntity.fromModel),
    };
  }
}
