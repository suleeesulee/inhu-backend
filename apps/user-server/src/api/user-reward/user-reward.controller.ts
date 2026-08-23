import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { UserRewardService } from './user-reward.service';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { UpdateUserRewardDto } from './dto/request/update-user-reward.dto';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { GetUserRewardStatusResponseDto } from './dto/response/get-user-reward-status.response.dto';

@Controller('user-reward')
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  /**
   * 로그인 사용자 보상 상태 조회
   * - 마이페이지의 상품 선택 필요 문구 노출 여부 확인 시 사용
   */
  @Get('status')
  @LoginAuth()
  public async getUserRewardStatus(
    @User() loginUser: LoginUser,
  ): Promise<GetUserRewardStatusResponseDto> {
    return await this.userRewardService.getUserRewardStatusByUserIdx(
      loginUser.idx,
    );
  }

  /**
   * 보상 선택
   * - 리그 시즌 결과 페이지에서 리워드 상품 선택 시 사용
   */
  @Put(':id')
  @LoginAuth()
  @Exception(400, 'Invalid request')
  @Exception(403, 'User is not school verified')
  @Exception(403, 'Reward is not available for this league season')
  @Exception(
    403,
    "Reward is not available for the user's rank in this league season",
  )
  @Exception(
    403,
    'Different user cannot select reward for this league season result',
  )
  @Exception(404, 'User reward not found')
  @Exception(404, 'Reward not found')
  @Exception(404, 'League-season-result-user-ranking not found')
  @Exception(409, 'Reward has already been selected')
  @Exception(409, 'Reward has already been issued')
  public async updateUserRewardById(
    @Body() dto: UpdateUserRewardDto,
    @Param('id', ParseUUIDPipe) id: string,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    await this.userRewardService.updateUserRewardById(id, dto, loginUser);
  }
}
