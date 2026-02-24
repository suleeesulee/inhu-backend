import { AdminAccountEntity } from '../../entity/admin-account.entity';

export class GetAdminAccountAllResponseDto {
  accountList: AdminAccountEntity[];
  count: number;
}
