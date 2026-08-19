import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetRewardAllResponseDto } from './dto/response/get-reward-all-response.dto';
import { CreateRewardDto } from './dto/request/create-reward.dto';
import { RewardEntity } from './entity/reward.entity';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { GetRewardAllDto } from './dto/request/get-reward-all.dto';
import { UpdateRewardDto } from './dto/request/update-reward.dto';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  /**
   * 리워드 전체 조회
   */
  @Get('/all')
  @AdminAuth()
  public async getRewardAll(
    @Query() dto: GetRewardAllDto,
  ): Promise<GetRewardAllResponseDto> {
    return await this.rewardService.getRewardAll(dto);
  }

  /**
   * 특정 리워드 조회
   */
  @Get('/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid reward idx')
  @Exception(404, 'Reward not found')
  public async getRewardByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<RewardEntity> {
    return await this.rewardService.getRewardByIdx(idx);
  }

  /**
   * 리워드 생성
   */
  @Post()
  @AdminAuth()
  @Exception(400, 'Invalid reward creation request')
  public async createReward(
    @Body() dto: CreateRewardDto,
  ): Promise<RewardEntity> {
    return await this.rewardService.createReward(dto);
  }

  /**
   * 리워드 수정
   */
  @Put('/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid reward update request')
  @Exception(404, 'Reward not found')
  public async updateRewardByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateRewardDto,
  ): Promise<void> {
    return await this.rewardService.updateRewardByIdx(idx, dto);
  }

  /**
   * 리워드 활성화
   */
  @Post('/:idx/activate')
  @AdminAuth()
  @Exception(404, 'Reward not found')
  @Exception(409, 'Reward already activated')
  public async activateRewardByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.rewardService.activateRewardByIdx(idx);
  }

  /**
   * 리워드 비활성화
   */
  @Post('/:idx/deactivate')
  @AdminAuth()
  @Exception(404, 'Reward not found')
  @Exception(409, 'Reward not activated')
  public async deactivateRewardByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.rewardService.deactivateRewardByIdx(idx);
  }

  /**
   * 리워드 삭제
   */
  @Delete('/:idx')
  @AdminAuth()
  @Exception(404, 'Reward not found')
  public async deleteRewardByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.rewardService.deleteRewardByIdx(idx);
  }
}
