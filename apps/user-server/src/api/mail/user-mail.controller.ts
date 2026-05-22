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

  /**
   * 대학 인증 코드 이메일로 발송
   */
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

  /**
   * 대학 인증 코드 검증
   */
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
