import { Controller, Post } from '@nestjs/common';
import { UserMailService } from './user-mail.service';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';

@Controller('')
export class UserMailController {
  constructor(private readonly userMailService: UserMailService) {}

  @Post('univ-verification/send-code')
  async sendVerificationEmail(@User() loginUser: LoginUser) {
    return await this.userMailService.sendVerificationEmail(loginUser.idx, ' ');
  }

  @Post('univ-verification/verify-code')
  async verifyCode(@User() loginUser: LoginUser) {
    return await this.userMailService.verifyCode(loginUser.idx, ' ');
  }
}
