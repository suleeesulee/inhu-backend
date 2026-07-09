import { Injectable } from '@nestjs/common';
import { PlaceVisitCoreRepository } from './place-visit-core.repository';
import { PlaceVisitModel } from './model/place-visit.model';
import { CreatePlaceVisitInput } from './model/inputs/create-place-visit.input';

@Injectable()
export class PlaceVisitCoreService {
  constructor(
    private readonly placeVisitCoreRepository: PlaceVisitCoreRepository,
  ) {}

  public async getPlaceVisitAllByUserIdx(
    userIdx: number,
  ): Promise<PlaceVisitModel[]> {
    return (
      await this.placeVisitCoreRepository.selectPlaceVisitAllByUserIdx(userIdx)
    ).map(PlaceVisitModel.fromPrisma);
  }

  public async getPlaceVisitById(id: string): Promise<PlaceVisitModel | null> {
    const placeVisit =
      await this.placeVisitCoreRepository.selectPlaceVisitById(id);
    return placeVisit && PlaceVisitModel.fromPrisma(placeVisit);
  }

  public async getUserScoreAllByPeriod(startAt: Date, endAt: Date) {}

  public async getUserTotalScoreAll() {}

  public async createPlaceVisit(
    input: CreatePlaceVisitInput,
  ): Promise<PlaceVisitModel> {
    return PlaceVisitModel.fromPrisma(
      await this.placeVisitCoreRepository.insertPlaceVisit(input),
    );
  }
}
