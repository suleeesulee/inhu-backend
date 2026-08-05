import { RewardCoreService } from '@libs/core/reward/reward-core.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetRewardAllResponseDto } from './dto/response/get-reward-all-response.dto';
import { RewardEntity } from './entity/reward.entity';
import { CreateRewardDto } from './dto/request/create-reward.dto';
import { UpdateRewardDto } from './dto/request/update-reward.dto';

@Injectable()
export class RewardService {
  constructor(private readonly rewardCoreService: RewardCoreService) {}

  public async getRewardAll(): Promise<GetRewardAllResponseDto> {
    return {
      rewardList: (await this.rewardCoreService.getRewardAll()).map((reward) =>
        RewardEntity.fromModel(reward),
      ),
    };
  }

  public async createReward(dto: CreateRewardDto): Promise<RewardEntity> {
    return RewardEntity.fromModel(
      await this.rewardCoreService.createReward({
        name: dto.name,
        imagePath: dto.imagePath ?? null,
        activatedAt: null,
      }),
    );
  }

  public async updateRewardByIdx(
    idx: number,
    dto: UpdateRewardDto,
  ): Promise<void> {
    const reward = await this.rewardCoreService.getRewardByIdx(idx);
    if (!reward) {
      throw new NotFoundException(`Reward with idx ${idx} not found`);
    }

    await this.rewardCoreService.updateRewardByIdx(idx, {
      name: dto.name,
      imagePath: dto.imagePath ?? null,
    });
  }

  public async activateRewardByIdx(idx: number): Promise<void> {
    const reward = await this.rewardCoreService.getRewardByIdx(idx);
    if (!reward) {
      throw new NotFoundException(`Reward with idx ${idx} not found`);
    }

    if (reward.activatedAt) {
      throw new ConflictException(
        `Reward with idx ${idx} is already activated`,
      );
    }

    await this.rewardCoreService.updateRewardByIdx(idx, {
      activatedAt: new Date(),
    });
  }

  public async deactivateRewardByIdx(idx: number): Promise<void> {
    const reward = await this.rewardCoreService.getRewardByIdx(idx);
    if (!reward) {
      throw new NotFoundException(`Reward with idx ${idx} not found`);
    }

    if (!reward.activatedAt) {
      throw new ConflictException(`Reward with idx ${idx} is not activated`);
    }

    await this.rewardCoreService.updateRewardByIdx(idx, {
      activatedAt: null,
    });
  }

  public async deleteRewardByIdx(idx: number): Promise<void> {
    const reward = await this.rewardCoreService.getRewardByIdx(idx);
    if (!reward) {
      throw new NotFoundException(`Reward with idx ${idx} not found`);
    }

    await this.rewardCoreService.deleteRewardByIdx(idx);
  }
}
