import { CafeteriaCoreService } from '@libs/core/cafeteria/cafeteria-core.service';
import { DailyMemoCoreService } from '@libs/core/daily-memo/daily-memo-core.service';
import { FoodStationCoreService } from '@libs/core/food-station/food-station-core.service';
import { Transactional } from '@nestjs-cls/transactional';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CafeteriaEntity } from './entity/cafeteria.entity';
import { CopyCafeteriaDataDto } from './dto/request/copy-cafeteria-data.dto';
import { CreateCafeteriaDto } from './dto/request/create-cafeteria.dto';
import { UpdateCafeteriaDto } from './dto/request/update-cafeteria.dto';

@Injectable()
export class CafeteriaService {
  constructor(
    private readonly cafeteriaCoreService: CafeteriaCoreService,
    private readonly dailyMemoCoreService: DailyMemoCoreService,
    private readonly foodStationCoreService: FoodStationCoreService,
  ) {}

  public async getCafeteriaAll(): Promise<CafeteriaEntity[]> {
    return (await this.cafeteriaCoreService.getCafeteriaAll()).map(
      CafeteriaEntity.fromModel,
    );
  }

  public async createCafeteria(
    dto: CreateCafeteriaDto,
  ): Promise<CafeteriaEntity> {
    return CafeteriaEntity.fromModel(
      await this.cafeteriaCoreService.createCafeteria(dto),
    );
  }

  public async updateCafeteriaByIdx(
    idx: number,
    dto: UpdateCafeteriaDto,
  ): Promise<void> {
    const cafeteria = await this.cafeteriaCoreService.getCafeteriaByIdx(idx);
    if (!cafeteria) {
      throw new NotFoundException('Cafeteria does not exist');
    }

    return this.cafeteriaCoreService.updateCafeteriaByIdx(idx, dto);
  }

  public async deleteCafeteriaByIdx(idx: number): Promise<void> {
    const cafeteria = await this.cafeteriaCoreService.getCafeteriaByIdx(idx);
    if (!cafeteria) {
      throw new NotFoundException('Cafeteria does not exist');
    }

    return this.cafeteriaCoreService.deleteCafeteriaByIdx(idx);
  }

  @Transactional()
  public async copyData(
    copyToCafeteriaIdx: number,
    dto: CopyCafeteriaDataDto,
  ): Promise<void> {
    const [fromCafeteria, toCafeteria] = await Promise.all([
      this.cafeteriaCoreService.getCafeteriaByIdx(dto.fromIdx),
      this.cafeteriaCoreService.getCafeteriaByIdx(copyToCafeteriaIdx),
    ]);

    if (!fromCafeteria) {
      throw new NotFoundException('From cafeteria does not exist');
    }
    if (!toCafeteria) {
      throw new NotFoundException('To cafeteria does not exist');
    }

    const [existingFoodStations, existingMemos] = await Promise.all([
      this.foodStationCoreService.getFoodStationAll({
        cafeteriaIdx: copyToCafeteriaIdx,
        startDate: dto.startDate,
        endDate: dto.endDate,
      }),
      this.dailyMemoCoreService.getDailyMemoAll({
        cafeteriaIdx: copyToCafeteriaIdx,
        startDate: dto.startDate,
        endDate: dto.endDate,
      }),
    ]);

    if (existingFoodStations.length > 0 || existingMemos.length > 0) {
      throw new ConflictException('Already exist some data in cafeteria');
    }

    await Promise.all([
      this.cafeteriaCoreService.copyDataToOtherCafeteria(
        dto.fromIdx,
        copyToCafeteriaIdx,
        dto,
      ),
      this.dailyMemoCoreService.copyDataToOtherCafeteria(
        dto.fromIdx,
        copyToCafeteriaIdx,
        dto,
      ),
    ]);
  }
}
