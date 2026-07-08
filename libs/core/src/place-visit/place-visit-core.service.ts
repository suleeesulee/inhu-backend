import { Injectable } from '@nestjs/common';
import { PlaceVisitCoreRepository } from './place-visit-core.repository';

@Injectable()
export class PlaceVisitCoreService {
  constructor(
    private readonly placeVisitCoreRepository: PlaceVisitCoreRepository,
  ) {}
}
