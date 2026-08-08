import { RewardCoreService } from '@libs/core/reward/reward-core.service';
import { UserRewardCoreService } from '@libs/core/user-reward/user-reward-core.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserRewardDto } from './dto/request/update-user-reward.dto';

@Injectable()
export class UserRewardService {
  constructor(
    private readonly userRewardCoreService: UserRewardCoreService,
    private readonly rewardCoreService: RewardCoreService,
  ) {}

  public async updateUserRewardById(
    id: string,
    dto: UpdateUserRewardDto,
  ): Promise<void> {
    const reward = await this.rewardCoreService.getRewardByIdx(dto.rewardIdx);
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    const userReward = await this.userRewardCoreService.getUserRewardById(id);
    if (!userReward || userReward.issuedAt) {
      throw new NotFoundException('User reward not found');
    }
    if (userReward.selectedAt) {
      throw new ConflictException('Reward has already been selected');
    }

    await this.userRewardCoreService.updateUserRewardById(id, {
      rewardIdx: dto.rewardIdx,
      selectedAt: new Date(),
    });
  }
}
