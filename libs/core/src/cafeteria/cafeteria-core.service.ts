import { Injectable } from '@nestjs/common';
import { CafeteriaCoreRepository } from './cafeteria-core.repository';
import { CafeteriaModel } from './model/cafeteria.model';
import { CreateCafeteriaInput } from './inputs/create-cafeteria.input';
import { UpdateCafeteriaInput } from './inputs/update-cafeteria.input';

@Injectable()
export class CafeteriaCoreService {
  constructor(
    private readonly cafeteriaCoreRepository: CafeteriaCoreRepository,
  ) {}

  public async getCafeteriaByIdx(idx: number): Promise<CafeteriaModel | null> {
    const cafeteria =
      await this.cafeteriaCoreRepository.selectCafeteriaByIdx(idx);
    return cafeteria && CafeteriaModel.fromPrisma(cafeteria);
  }

  public async getCafeteriaAll(): Promise<CafeteriaModel[]> {
    return (await this.cafeteriaCoreRepository.selectCafeteriaAll()).map(
      CafeteriaModel.fromPrisma,
    );
  }

  public async createCafeteria(
    input: CreateCafeteriaInput,
  ): Promise<CafeteriaModel> {
    return CafeteriaModel.fromPrisma(
      await this.cafeteriaCoreRepository.insertCafeteria(input),
    );
  }

  public async updateCafeteriaByIdx(
    idx: number,
    input: UpdateCafeteriaInput,
  ): Promise<void> {
    await this.cafeteriaCoreRepository.updateCafeteriaByIdx(idx, input);
  }

  public async deleteCafeteriaByIdx(idx: number): Promise<void> {
    await this.cafeteriaCoreRepository.softDeleteCafeteriaByIdx(idx);
  }
}
