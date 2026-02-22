import { LoginAdmin } from '@admin/common/login-admin';
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

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminAccountCoreService: AdminAccountCoreService,
    private readonly hashService: HashService,
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

  public async createAdminAccount(
    dto: CreateAdminAccountDto,
  ): Promise<AdminAccountEntity> {
    if (dto.role !== AdminRole.SuperAdmin) {
      throw new ForbiddenException('permission denied');
    }

    return AdminAccountEntity.fromModel(
      await this.adminAccountCoreService.createAdminAccount({
        id: dto.id,
        pw: await this.hashService.hash(dto.pw),
        nickname: dto.nickname,
        role: dto.role,
      }),
    );
  }

  public async deleteAdminAccountByIdx(idx: number): Promise<void> {
    const adminAccountModel =
      await this.adminAccountCoreService.getAdminAccountByIdx(idx);
    if (!adminAccountModel) {
      throw new NotFoundException('Admin account not found');
    }

    await this.adminAccountCoreService.deleteAdminAccountByIdx(idx);
  }
}
