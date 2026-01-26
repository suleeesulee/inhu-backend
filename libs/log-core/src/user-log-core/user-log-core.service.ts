import { Injectable } from '@nestjs/common';
import { UserLogCoreRepository } from './user-log-core.repository';
import { CreateDimUserInput } from './inputs/create-dim-user.input';
import { Transactional } from '@nestjs-cls/transactional';
import { CreateDimUserProviderInput } from './inputs/create-dim-user-provider.input';

@Injectable()
export class UserLogCoreService {
  constructor(private readonly userLogCoreRepository: UserLogCoreRepository) {}

  @Transactional()
  public async createDimUser(input: CreateDimUserInput, updatedAt: Date) {
    await this.userLogCoreRepository.insertDimUser({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimUserProvider(
    input: CreateDimUserProviderInput,
    updatedAt: Date,
  ) {
    await this.userLogCoreRepository.insertDimUserProvider({
      ...input,
      validFrom: updatedAt,
    });
  }
}
