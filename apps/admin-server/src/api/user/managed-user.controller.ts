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
import { ApiTags } from '@nestjs/swagger';
import { ManagedUserService } from './managed-user.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { AdminRole } from '../auth/admin-role.enum';
import { CreateManagedUserDto } from './dto/request/create-managed-user.dto';
import { ManagedUserEntity } from './entity/managed-user.entity';
import { GetManagedUserAllDto } from './dto/request/get-managed-user-all.dto';
import { GetManagedUserAllResponseDto } from './dto/response/get-managed-user-response.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { UpdateManagedUserDto } from './dto/request/update-managed-user.dto';

@Controller()
@ApiTags('Managed User')
export class ManagedUserController {
  constructor(private readonly managedUserService: ManagedUserService) {}

  /**
   * ManagedUser 목록 보기
   *
   * @author jochong
   */
  @Get('/managed-user')
  @AdminAuth(AdminRole.SuperAdmin)
  public async getManagedUserAll(
    @Query() dto: GetManagedUserAllDto,
  ): Promise<GetManagedUserAllResponseDto> {
    return await this.managedUserService.getManagedUserAll(dto);
  }

  /**
   * Managed User 자세히보기
   *
   * @author jochong
   */
  @Get('/managed-user/:idx')
  @Exception(404, 'managed user not found')
  @AdminAuth(AdminRole.SuperAdmin)
  public async getManagedUserByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<ManagedUserEntity> {
    return await this.managedUserService.getManagedUserByIdx(idx);
  }

  /**
   * ManagedUser 생성하기
   *
   * @author jochong
   */
  @Post('/managed-user')
  @AdminAuth(AdminRole.SuperAdmin)
  public async createManagedUser(
    @Body() dto: CreateManagedUserDto,
  ): Promise<ManagedUserEntity> {
    return await this.managedUserService.createManagedUser(dto);
  }

  /**
   * Managed User 수정하기
   *
   * @author jochong
   */
  @Put('/managed-user/:idx')
  @Exception(404, 'managed user not found')
  @AdminAuth(AdminRole.SuperAdmin)
  public async updateManagedUserByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateManagedUserDto,
  ) {
    return await this.managedUserService.updateManagedUserByIdx(idx, dto);
  }

  /**
   * Managed User 삭제하기
   *
   * @author jochong
   */
  @Delete('/managed-user/:idx')
  @Exception(404, 'managed user not found')
  @AdminAuth(AdminRole.SuperAdmin)
  public async deleteManagedUserByIdx(@Param('idx', ParseIntPipe) idx: number) {
    return await this.managedUserService.deleteManagedUserByIdx(idx);
  }
}
