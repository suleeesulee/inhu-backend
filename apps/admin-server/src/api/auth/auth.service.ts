import { LoginAdmin } from '@admin/common/types/login-admin';
import { HashService } from '@libs/common/modules/hash/hash.service';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InvalidIdOrPwException } from 'apps/admin-server/src/api/auth/exception/invalid-id-or-pw.exception';
import { LoginTokenService } from 'apps/admin-server/src/common/modules/login-token/login-token.service';
import { ComparePasswordDto } from './dto/request/compare-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly loginTokenService: LoginTokenService,
    private readonly adminAccountCoreService: AdminAccountCoreService,
  ) {}

  public async login(id: string, pw: string): Promise<string> {
    const adminAccount =
      await this.adminAccountCoreService.getAdminAccountById(id);

    if (!adminAccount) {
      throw new InvalidIdOrPwException('Invalid ID or password');
    }

    const isPasswordValid = await this.hashService.compare(pw, adminAccount.pw);

    if (!isPasswordValid) {
      throw new InvalidIdOrPwException('Invalid ID or password');
    }

    const token = await this.loginTokenService.generateAdminToken(
      adminAccount.idx,
      adminAccount.role,
    );

    return token;
  }

  public async comparePassword(
    admin: LoginAdmin,
    dto: ComparePasswordDto,
  ): Promise<boolean> {
    const adminModel = await this.adminAccountCoreService.getAdminAccountByIdx(
      admin.idx,
    );
    if (!adminModel) {
      throw new NotFoundException('Admin account not found');
    }

    return await this.hashService.compare(dto.pw, adminModel.pw);
  }
}
