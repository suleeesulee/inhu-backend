import { Controller, Get, Post, Query } from '@nestjs/common';
import { AdminAccountService } from './admin-account.service';
import { Admin } from '@admin/common/decorator/admin.decorator';
import { LoginAdmin } from '@admin/common/login-admin';
import { AdminAccountEntity } from './entity/admin-account.entity';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { AdminRole } from '../auth/admin-role.enum';
import { CreateAdminAccountDto } from './dto/request/create-admin-account.dto';
import { GetAdminAccountAllDto } from './dto/request/get-admin-account-all.dto';
import { GetAdminAccountAllResponseDto } from './dto/response/get-admin-account-all-response.dto';

@Controller('admin-account')
export class AdminAccountController {
  constructor(private readonly adminAccountService: AdminAccountService) {}

  /**
   * 관리자 목록 조회
   */
  @Get()
  @AdminAuth(AdminRole.SuperAdmin)
  async getAdminAccountAll(
    @Query() dto: GetAdminAccountAllDto,
  ): Promise<GetAdminAccountAllResponseDto> {
    return await this.adminAccountService.getAdminAccountAll(dto);
  }

  /**
   * 내 정보 조회
   */
  @Get('/my')
  @AdminAuth(AdminRole.All)
  async getMyInfo(@Admin() admin: LoginAdmin): Promise<AdminAccountEntity> {
    return await this.adminAccountService.getAdminAccountByIdx(admin);
  }

  /**
   * 관리자 계정 생성
   */
  @Post()
  @AdminAuth(AdminRole.SuperAdmin)
  async createAdminAccount(
    dto: CreateAdminAccountDto,
  ): Promise<AdminAccountEntity> {
    return await this.adminAccountService.createAdminAccount(dto);
  }
}
