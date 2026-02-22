import { AdminRole } from '@admin/api/auth/admin-role.enum';

export type TokenPayload = {
  idx: number;
  /**
   * @default AdminRole.Admin
   */
  role?: AdminRole;
};
