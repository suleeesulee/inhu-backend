import { AdminRole } from '@admin/api/auth/admin-role.enum';

/**
 * Admin account 시드 입력 타입 정의
 *
 * @publicApi
 */
export type AdminAccountSeedInput = {
  userIdx: number;
  id?: string;
  pw?: string;
  role?: AdminRole;
};
