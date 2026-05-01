import { CafeteriaCoreService } from '@libs/core/cafeteria/cafeteria-core.service';
import { Injectable } from '@nestjs/common';
import { CreateCafeteriaDto } from './dto/request/create-cafeteria.dto';
import { UpdateCafeteriaDto } from './dto/request/update-cafeteria.dto';
import { CafeteriaEntity } from './entity/cafeteria.entity';

@Injectable()
export class CafeteriaService {
  constructor(private readonly cafeteriaCoreService: CafeteriaCoreService) {}

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
    return this.cafeteriaCoreService.updateCafeteriaByIdx(idx, dto);
  }

  public async deleteCafeteriaByIdx(idx: number): Promise<void> {
    return this.cafeteriaCoreService.deleteCafeteriaByIdx(idx);
  }
}
