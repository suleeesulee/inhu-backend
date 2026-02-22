import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminLoginAuthGuard } from '../../api/auth/admin-login-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { AdminRoles } from './admin-roles.decorator';

/**
 * @param roles 없을 경우 AdminRole.Admin 권한으로 확인
 * @returns
 */
export const AdminAuth = (...roles: AdminRole[]) => {
  return applyDecorators(
    UseGuards(AdminLoginAuthGuard),
    AdminRoles(...roles),
    ApiBearerAuth(),
    Exception(401, 'token not provided or expired'),
  );
};
