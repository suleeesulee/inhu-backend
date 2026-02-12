import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PlaceTypeLogCoreRepository } from './place-type-log-core.repository';
import { CreateDimPlaceTypeInput } from './inputs/create-dim-place-type.input';

@Injectable()
export class PlaceTypeLogCoreService {
  constructor(
    private readonly placeTypeLogCoreRepository: PlaceTypeLogCoreRepository,
  ) {}

  @Transactional()
  public async createDimPlaceType(
    input: CreateDimPlaceTypeInput,
    updatedAt: Date,
  ) {
    await this.placeTypeLogCoreRepository.insertDimPlaceType({
      ...input,
      validFrom: updatedAt,
    });
  }
}
