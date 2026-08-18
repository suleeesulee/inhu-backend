import { Exception } from '@libs/common/decorator/exception.decorator';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { GetUserRewardAllDto } from './dto/request/get-user-reward-all.dto';
import { GetUserRewardAllResponseDto } from './dto/response/get-user-reward-all.response.dto';
import { UserRewardService } from './user-reward.service';
import { UserRewardEntity } from './entity/user-reward.entity';

@Controller('user-reward')
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  /**
   * 사용자 리워드 전체 조회
   */
  @Get('/all')
  @AdminAuth()
  @Exception(400, 'Invalid request data')
  @Exception(404, 'League season not found')
  @Exception(404, 'User not found')
  @Exception(404, 'Reward not found')
  public async getUserRewardAll(
    @Query() dto: GetUserRewardAllDto,
  ): Promise<GetUserRewardAllResponseDto> {
    return await this.userRewardService.getUserRewardAll(dto);
  }

  /**
   * 특정 사용자 리워드 조회
   */
  @Get('/:id')
  @AdminAuth()
  @Exception(400, 'Invalid user reward id')
  @Exception(404, 'User reward not found')
  @Exception(404, 'League season result not found')
  @Exception(404, 'User not found')
  @Exception(404, 'Reward not found')
  public async getUserRewardById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserRewardEntity> {
    return await this.userRewardService.getUserRewardById(id);
  }

  /**
   * 특정 사용자 리워드 발급
   */
  @Post('/:id/issue')
  @HttpCode(200)
  @AdminAuth()
  @Exception(400, 'Invalid user reward id')
  @Exception(403, 'User school email not found')
  @Exception(404, 'User reward not found')
  @Exception(404, 'League season result not found')
  @Exception(404, 'Reward not found')
  @Exception(409, 'User reward already issued')
  @Exception(409, 'User has not selected a reward')
  public async issueUserRewardById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.userRewardService.issueUserRewardById(id);
  }
}
