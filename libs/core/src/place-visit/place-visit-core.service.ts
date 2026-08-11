import { Injectable } from '@nestjs/common';
import { PlaceVisitCoreRepository } from './place-visit-core.repository';
import { PlaceVisitModel } from './model/place-visit.model';
import { CreatePlaceVisitInput } from './model/inputs/create-place-visit.input';
import { GetPlaceVisitAllInput } from './model/inputs/get-place-visit-all.input';
import { GetPlaceVisitStatisticAllInput } from './model/inputs/get-place-visit-statistic-all.input';
import { PlaceVisitStatisticModel } from './model/place-visit-statistic.model';

@Injectable()
export class PlaceVisitCoreService {
  constructor(
    private readonly placeVisitCoreRepository: PlaceVisitCoreRepository,
  ) {}

  public async getPlaceVisitAllByUserIdx(
    userIdx: number,
    input: GetPlaceVisitAllInput,
  ): Promise<PlaceVisitModel[]> {
    return (
      await this.placeVisitCoreRepository.selectPlaceVisitAllByUserIdx(
        userIdx,
        input,
      )
    ).map(PlaceVisitModel.fromPrisma);
  }

  public async getPlaceVisitById(id: string): Promise<PlaceVisitModel | null> {
    const placeVisit =
      await this.placeVisitCoreRepository.selectPlaceVisitById(id);
    return placeVisit && PlaceVisitModel.fromPrisma(placeVisit);
  }

  public async getPlaceVisitStatisticAllByUserIdxAndPeriod(
    userIdx: number,
    input: GetPlaceVisitStatisticAllInput,
  ): Promise<PlaceVisitStatisticModel[]> {
    return (
      await this.placeVisitCoreRepository.selectPlaceVisitStatisticAllByUserIdxAndPeriod(
        userIdx,
        input,
      )
    ).map(PlaceVisitStatisticModel.fromQuery);
  }

  public async createPlaceVisit(
    input: CreatePlaceVisitInput,
  ): Promise<PlaceVisitModel> {
    return PlaceVisitModel.fromPrisma(
      await this.placeVisitCoreRepository.insertPlaceVisit(input),
    );
  }
}
