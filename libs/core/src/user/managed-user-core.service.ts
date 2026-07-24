import { Injectable } from '@nestjs/common';
import { ManagedUserCoreRepository } from './managed-user-core.repository';
import { ManagedUserModel } from './model/managed-user.model';
import { GetManagedUserOverviewInput } from './inputs/get-managed-user-overview.input';
import { UpdateManagedUserInput } from './inputs/update-managed-user.input';
import { CreateManagedUserInput } from './inputs/create-managed-user.input';

@Injectable()
export class ManagedUserCoreService {
  constructor(
    private readonly managedUserCoreRepository: ManagedUserCoreRepository,
  ) {}

  public async getManagedUserByIdx(
    idx: number,
  ): Promise<ManagedUserModel | null> {
    const user =
      await this.managedUserCoreRepository.selectManagedUserByIdx(idx);

    return user && ManagedUserModel.formPrisma(user);
  }

  public async getManagedUserAll(
    input: GetManagedUserOverviewInput,
  ): Promise<ManagedUserModel[]> {
    return (
      await this.managedUserCoreRepository.selectManagedUserAll(input)
    ).map(ManagedUserModel.formPrisma);
  }

  public async getManagedUserCount(
    input: GetManagedUserOverviewInput,
  ): Promise<number> {
    return await this.managedUserCoreRepository.selectManagedUserCount(input);
  }

  public async createManagedUser(
    input: CreateManagedUserInput,
  ): Promise<ManagedUserModel> {
    return ManagedUserModel.formPrisma(
      await this.managedUserCoreRepository.insertManagedUser(input),
    );
  }

  public async updateManagedUserByIdx(
    idx: number,
    input: UpdateManagedUserInput,
  ): Promise<void> {
    await this.managedUserCoreRepository.updateManagedUserByIdx(idx, input);
  }

  public async deleteManagedUserByIdx(idx: number): Promise<void> {
    await this.managedUserCoreRepository.deleteManagedUserByIdx(idx);
  }
}
