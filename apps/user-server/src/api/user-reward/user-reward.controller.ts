import { Body, Controller, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { UserRewardService } from './user-reward.service';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { UpdateUserRewardDto } from './dto/request/update-user-reward.dto';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';

@Controller('user-reward')
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  /**
   * 보상 선택
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
