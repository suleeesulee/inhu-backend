import { AdminRole } from '@admin/api/auth/admin-role.enum';

export class CreateAdminAccountInput {
  id: string;
  pw: string;
  nickname: string;
  role: AdminRole;
}
