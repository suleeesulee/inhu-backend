import { Injectable } from '@nestjs/common';
import { UserRewardCoreRepository } from './user-reward-core.repository';

@Injectable()
export class UserRewardCoreService {
  constructor(
    private readonly userRewardCoreRepository: UserRewardCoreRepository,
  ) {}
}
