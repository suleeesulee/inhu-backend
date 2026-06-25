import { Injectable } from '@nestjs/common';
import { UserCoreRepository } from './user-core.repository';
import { CreateUserInput } from './inputs/create-user.input';
import { UserModel } from './model/user.model';
import { AuthProvider } from './constants/auth-provider.constant';
import { UpdateUserInput } from '@libs/core/user/inputs/update-user.input';
import { GetAllUsersInput } from './inputs/get-user-overview.input';
import { UserForAdminModel } from './model/user-for-admin.model';
import { CryptoService } from '@libs/common/modules/crypto/crypto.service';
import { SelectUser } from './model/prisma-type/select-user';
import { SelectUserForAdmin } from './model/prisma-type/select-user-for-admin';

/**
 * 사용자 코어 서비스
 *
 * @publicApi
 */
@Injectable()
export class UserCoreService {
  constructor(
    private readonly userCoreRepository: UserCoreRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  // ! temporary
  public async getUserByNickname(nickname: string): Promise<UserModel | null> {
    const user = await this.userCoreRepository.selectUserByNickname(nickname);

    return user && this.toUserModel(user);
  }

  public async getUserByIdx(idx: number): Promise<UserModel | null> {
    const user = await this.userCoreRepository.selectUserByIdx(idx);

    return user && this.toUserModel(user);
  }

  public async getUserBySocialId(
    snsId: string,
    provider: AuthProvider,
  ): Promise<UserModel | null> {
    const user = await this.userCoreRepository.selectUserBySnsId(
      snsId,
      provider,
    );

    return user && this.toUserModel(user);
  }

  public async getUserBySchoolEmail(
    schoolEmailHash: string,
  ): Promise<UserModel | null> {
    const user =
      await this.userCoreRepository.selectUserBySchoolEmail(schoolEmailHash);

    return user && this.toUserModel(user);
  }

  public async getUserAll(
    input: GetAllUsersInput,
  ): Promise<UserForAdminModel[]> {
    const users = await this.userCoreRepository.selectUserAll(input);

    return users.map((user) => this.toUserForAdminModel(user));
  }

  public async getUserOverviewCount(): Promise<number> {
    return this.userCoreRepository.selectUserCount();
  }

  public async createUser(input: CreateUserInput): Promise<UserModel> {
    return await this.userCoreRepository
      .insertUser(input)
      .then((user) => this.toUserModel(user));
  }

  public async updateUserByIdx(
    idx: number,
    input: UpdateUserInput,
  ): Promise<void> {
    const schoolEmail = input.schoolEmail;

    return this.userCoreRepository.updateUserByIdx(idx, {
      ...input,
      schoolEmailEncrypted: schoolEmail
        ? this.cryptoService.encrypt(schoolEmail)
        : undefined,
      schoolEmailHash: schoolEmail
        ? this.cryptoService.hmacDigest(schoolEmail)
        : undefined,
    });
  }

  public async deleteUserByIdx(idx: number): Promise<void> {
    return this.userCoreRepository.softDeleteUserByIdx(idx);
  }

  private toUserModel(user: SelectUser): UserModel {
    return UserModel.fromPrisma(
      user,
      user.schoolEmailEncrypted
        ? this.cryptoService.decrypt(user.schoolEmailEncrypted)
        : null,
    );
  }

  private toUserForAdminModel(user: SelectUserForAdmin): UserForAdminModel {
    return UserForAdminModel.fromPrisma(
      user,
      user.schoolEmailEncrypted
        ? this.cryptoService.decrypt(user.schoolEmailEncrypted)
        : null,
    );
  }
}
