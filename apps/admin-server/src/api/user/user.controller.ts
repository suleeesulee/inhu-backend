import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetUserOverviewAllDto } from './dto/request/get-user-overview-all.dto';
import { GetUserOverviewAllResponseDto } from './dto/response/get-user-overview-all-response.dto';
import { UserEntity } from './entity/user.entity';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 목록 조회 Endpoint
   */
  @Get()
  @AdminAuth()
  public async getUserOverviewAll(
    @Query() getUserOverviewDto: GetUserOverviewAllDto,
  ): Promise<GetUserOverviewAllResponseDto> {
    return await this.userService.getUserAll(getUserOverviewDto);
  }

  /**
   * 사용자 상세 조회 Endpoint
   */
  @Get('/:idx')
  @AdminAuth()
  @Exception(400, 'invalid idx')
  @Exception(404, 'user not found')
  public async getUserByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<UserEntity> {
    return await this.userService.getUserByIdx(idx);
  }
}
