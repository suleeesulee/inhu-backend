import { Injectable } from '@nestjs/common';
import { PlaceLogCoreRepository } from './place-log-core.repository';

@Injectable()
export class PlaceLogCoreService {
  constructor(
    private readonly placeLogCoreRepository: PlaceLogCoreRepository,
  ) {}
}
