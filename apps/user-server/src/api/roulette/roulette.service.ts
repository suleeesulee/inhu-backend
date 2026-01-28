import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { Injectable } from '@nestjs/common';
import { GetRouletteItemDto } from './dto/request/get-roulette-item.dto';
import { RouletteItemEntity } from './entity/roulette-item.entity';
import { ConfigService } from '@nestjs/config';
import { GetRouletteItemResponseDto } from './dto/response/get-roulette-item.request.dto';

@Injectable()
export class RouletteService {
  private readonly TARGET_PLACE_IDX_LIST: number[];
  private readonly MULTIPLIER: number;

  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly configService: ConfigService,
  ) {
    this.TARGET_PLACE_IDX_LIST =
      this.configService.get<number[]>('roulette.TARGET_PLACE_IDX_LIST') || [];
    this.MULTIPLIER =
      this.configService.get<number>('roulette.MULTIPLIER') || 1;
  }

  public async getRouletteItem(
    dto: GetRouletteItemDto,
  ): Promise<GetRouletteItemResponseDto> {
    const placeOverviewModel = await this.placeCoreService.getRouletteItemAll({
      operating: dto.operating,
      types: dto.type ? [dto.type] : undefined,
      activated: true,
      permanentlyClosed: false,
      mainCategoryList: dto.mainCategoryList,
      moodCategoryList: dto.moodCategoryList,
    });

    const targetSet = new Set(this.TARGET_PLACE_IDX_LIST);
    const weightedPlaceOverviewModelList = placeOverviewModel.map((item) => ({
      item,
      weight: targetSet.has(item.idx) ? this.MULTIPLIER : 1,
    }));

    return {
      rouletteItemList: weightedPlaceOverviewModelList.map(({ item, weight }) =>
        RouletteItemEntity.fromModel(item, weight),
      ),
    };
  }
}
