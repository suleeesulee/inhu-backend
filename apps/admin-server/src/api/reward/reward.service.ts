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
import { GetRewardAllDto } from './dto/request/get-reward-all.dto';

@Injectable()
export class RewardService {
  constructor(private readonly rewardCoreService: RewardCoreService) {}

  public async getRewardAll(
    dto: GetRewardAllDto,
  ): Promise<GetRewardAllResponseDto> {
    const pageSize = 10;
    const input = {
      take: pageSize,
      skip: (dto.page - 1) * pageSize,
      order: dto.order,
      activated: dto.activated,
    };
    const [rewardList, count] = await Promise.all([
      this.rewardCoreService.getRewardAll(input),
      this.rewardCoreService.getRewardCount(input),
    ]);

    return {
      count,
      rewardList: rewardList.map(RewardEntity.fromModel),
    };
  }

  public async getRewardByIdx(idx: number): Promise<RewardEntity> {
    const reward = await this.rewardCoreService.getRewardByIdx(idx);
    if (!reward) {
      throw new NotFoundException(`Reward with idx ${idx} not found`);
    }

    return RewardEntity.fromModel(reward);
  }

  public async createReward(dto: CreateRewardDto): Promise<RewardEntity> {
    return RewardEntity.fromModel(
      await this.rewardCoreService.createReward({
        name: dto.name,
        imagePath: dto.imagePath,
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
      imagePath: dto.imagePath,
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
