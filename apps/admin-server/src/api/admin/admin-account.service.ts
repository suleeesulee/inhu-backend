import { LoginAdmin } from '@admin/common/types/login-admin';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminAccountEntity } from './entity/admin-account.entity';
import { CreateAdminAccountDto } from './dto/request/create-admin-account.dto';
import { GetAdminAccountAllDto } from './dto/request/get-admin-account-all.dto';
import { AdminRole } from '../auth/admin-role.enum';
import { HashService } from '@libs/common/modules/hash/hash.service';
import { CheckAdminIdDuplicateDto } from './dto/request/check-admin-id-duplicate.dto';
import { randomBytes } from 'crypto';
import { CreateAdminAccountEntity } from './entity/create-admin-account.entity';
import { LoginTokenService } from '@admin/common/modules/login-token/login-token.service';
import { UpdateAdminAccountDto } from './dto/request/update-admin-account.dto';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminAccountCoreService: AdminAccountCoreService,
    private readonly hashService: HashService,
    private readonly loginTokenService: LoginTokenService,
  ) {}

  /**
   * 모든 관리자 계정 조회
   */
  public async getAdminAccountAll(dto: GetAdminAccountAllDto): Promise<{
    accountList: AdminAccountEntity[];
    count: number;
  }> {
    const [accountList, count] = await Promise.all([
      this.adminAccountCoreService
        .getAdminAccountAll({
          take: 10,
          skip: (dto.page - 1) * 10,
        })
        .then((data) => data.map(AdminAccountEntity.fromModel)),
      this.adminAccountCoreService.getAdminAccountCount(),
    ]);

    return {
      accountList,
      count,
    };
  }

  /**
   * 내 정보 조회
   */
  public async getAdminAccountByIdx(
    admin: LoginAdmin,
  ): Promise<AdminAccountEntity> {
    const adminModel = await this.adminAccountCoreService.getAdminAccountByIdx(
      admin.idx,
    );
    if (!adminModel) {
      throw new NotFoundException('Admin account not found');
    }

    return AdminAccountEntity.fromModel(adminModel);
  }

  public async checkAdminIdDuplicate(
    dto: CheckAdminIdDuplicateDto,
  ): Promise<boolean> {
    return (
      (await this.adminAccountCoreService.getAdminAccountById(dto.id)) !== null
    );
  }

  public async createAdminAccount(
    dto: CreateAdminAccountDto,
  ): Promise<CreateAdminAccountEntity> {
    if (dto.role === AdminRole.SuperAdmin) {
      throw new ForbiddenException('permission denied');
    }

    const pw = dto.pw ? dto.pw : this.generateTempPassword(12);

    return CreateAdminAccountEntity.fromModel(
      await this.adminAccountCoreService.createAdminAccount({
        nickname: dto.nickname,
        id: dto.id,
        pw: await this.hashService.hash(pw),
        role: dto.role,
      }),
      pw,
    );
  }

  public async updateAdminAccountByIdx(
    admin: LoginAdmin,
    dto: UpdateAdminAccountDto,
  ): Promise<void> {
    const adminModel = await this.adminAccountCoreService.getAdminAccountByIdx(
      admin.idx,
    );
    if (!adminModel) {
      throw new NotFoundException('Admin account not found');
    }

    await this.adminAccountCoreService.updateAdminAccountByIdx(admin.idx, {
      id: dto.id,
      pw: dto.pw ? await this.hashService.hash(dto.pw) : undefined,
      nickname: dto.nickname,
    });
  }

  public async deleteAdminAccountByIdx(idx: number): Promise<void> {
    const adminAccountModel =
      await this.adminAccountCoreService.getAdminAccountByIdx(idx);
    if (!adminAccountModel) {
      throw new NotFoundException('Admin account not found');
    }
    if (adminAccountModel.role === AdminRole.SuperAdmin) {
      throw new ForbiddenException('permission denied');
    }

    await this.loginTokenService.revokeAdminToken(idx);
    await this.adminAccountCoreService.deleteAdminAccountByIdx(idx);
  }

  private generateTempPassword(length = 12): string {
    return randomBytes(32).toString('base64url').slice(0, length);
  }
}
