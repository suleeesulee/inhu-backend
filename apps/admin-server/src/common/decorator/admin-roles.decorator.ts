import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { SetMetadata } from '@nestjs/common';

export const ADMIN_ROLES_METADATA_KEY = 'ADMIN-APP:ADMIN_ROLES_METADATA_KEY';
export const AdminRoles = (...roles: AdminRole[]) =>
  SetMetadata(ADMIN_ROLES_METADATA_KEY, roles);
