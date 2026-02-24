import { AdminRole } from '@admin/api/auth/admin-role.enum';

export type LoginAdmin = {
  idx: number;
  role: AdminRole;
};
