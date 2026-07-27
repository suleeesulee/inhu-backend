import { ManagedUserEntity } from '../../entity/managed-user.entity';

export class GetManagedUserAllResponseDto {
  public userList: ManagedUserEntity[];
  public count: number;
}
