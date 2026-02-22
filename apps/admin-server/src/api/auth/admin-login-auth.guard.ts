import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from '../../common/modules/login-token/types/TokenPayload';
import { Reflector } from '@nestjs/core';
import { AdminRole, AdminRoleOrder } from './admin-role.enum';
import { ADMIN_ROLES_METADATA_KEY } from '@admin/common/decorator/admin-roles.decorator';

@Injectable()
export class AdminLoginAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const admin: TokenPayload = (request as any).admin;

    if (!admin) {
      throw new UnauthorizedException('Admin not authenticated');
    }

    const requireRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ADMIN_ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    const userRole = admin.role || AdminRole.Admin;
    const lowestRole = this.getRoleOrder(requireRoles);

    /**
     * 현재 명시된 권한보다 높은지 확인하기
     */
    if (AdminRoleOrder[userRole] > AdminRoleOrder[lowestRole]) {
      return true;
    }

    return requireRoles.includes(userRole);
  }

  /**
   * 현재 관리자 권한 목록 중
   * 서열이 가장 낮은 Role 가져오기
   */
  private getRoleOrder(roles: AdminRole[]): AdminRole {
    // 명시된 Role이 없을 경우, AdminRole.Admin 만 접근 가능한 것으로 판단
    if (!roles.length) return AdminRole.Admin;

    return roles.reduce(
      (resultRole, role) =>
        AdminRoleOrder[resultRole] < AdminRoleOrder[role] ? resultRole : role,
      roles[0],
    );
  }
}
