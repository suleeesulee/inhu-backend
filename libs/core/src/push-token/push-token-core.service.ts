import { Injectable } from '@nestjs/common';
import { PushTokenCoreRepository } from './push-token-core.repository';

@Injectable()
export class PushTokenCoreService {
  constructor(
    private readonly pushTokenCoreRepository: PushTokenCoreRepository,
  ) {}
}
