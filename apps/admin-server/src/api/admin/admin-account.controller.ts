import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AdminAccountService } from './admin-account.service';
import { Admin } from '@admin/common/decorator/admin.decorator';
import { LoginAdmin } from '@admin/common/types/login-admin';
import { AdminAccountEntity } from './entity/admin-account.entity';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { AdminRole } from '../auth/admin-role.enum';
import { CreateAdminAccountDto } from './dto/request/create-admin-account.dto';
import { GetAdminAccountAllDto } from './dto/request/get-admin-account-all.dto';
import { GetAdminAccountAllResponseDto } from './dto/response/get-admin-account-all-response.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { CheckAdminIdDuplicateDto } from './dto/request/check-admin-id-duplicate.dto';

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
  @Exception(404, 'Admin account not found')
  async getMyInfo(@Admin() admin: LoginAdmin): Promise<AdminAccountEntity> {
    return await this.adminAccountService.getAdminAccountByIdx(admin);
  }

  @Get('/check-id')
  @AdminAuth(AdminRole.SuperAdmin)
  async checkAdminIdDuplicate(
    @Query() dto: CheckAdminIdDuplicateDto,
  ): Promise<boolean> {
    return await this.adminAccountService.checkAdminIdDuplicate(dto);
  }

  /**
   * 관리자 계정 생성
   */
  @Post()
  @AdminAuth(AdminRole.SuperAdmin)
  async createAdminAccount(
    @Body() dto: CreateAdminAccountDto,
  ): Promise<AdminAccountEntity> {
    return await this.adminAccountService.createAdminAccount(dto);
  }

  @Delete('/:idx')
  @AdminAuth(AdminRole.SuperAdmin)
  @Exception(404, 'Admin account not found')
  async deleteAdminAccount(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.adminAccountService.deleteAdminAccountByIdx(idx);
  }
}
