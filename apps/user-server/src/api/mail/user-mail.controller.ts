import { Body, Controller, Post } from '@nestjs/common';
import { UserMailService } from './user-mail.service';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { SendVerificationCodeDto } from './dto/request/send-verification-code.dto';
import { VerifyCodeDto } from './dto/request/verify-code.dto';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';

@Controller('')
export class UserMailController {
  constructor(private readonly userMailService: UserMailService) {}

  @LoginAuth()
  @Post('univ-verification/send-code')
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    return await this.userMailService.sendVerificationCode(
      loginUser.idx,
      sendVerificationCodeDto.email,
    );
  }

  @LoginAuth()
  @Post('univ-verification/verify-code')
  async verifyCode(
    @Body() verifyCodeDto: VerifyCodeDto,
    @User() loginUser: LoginUser,
  ): Promise<boolean> {
    return await this.userMailService.verifyCode(
      loginUser.idx,
      verifyCodeDto.code,
    );
  }
}
