import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { DeleteUserDto } from './dto/request/delete-user.dto';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  @Get()
  @LoginAuth()
  async getMyInfo(@User() user: LoginUser): Promise<UserEntity> {
    return await this.userService.getMyInfo(user);
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  @Patch()
  @LoginAuth()
  async updateMyInfo(
    @User() user: LoginUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.userService.updateMyInfo(user, updateUserDto);
  }

  /**
   * 회원 탈퇴
   */
  @Delete('')
  @LoginAuth()
  async deleteUserByIdx(
    @User() user: LoginUser,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<void> {
    const refreshToken = deleteUserDto.refreshTokenWithType.replace(
      'Bearer ',
      '',
    );
    await this.userService.deleteUserByIdx(user);
    await this.authService.logout(refreshToken);
  }
}
