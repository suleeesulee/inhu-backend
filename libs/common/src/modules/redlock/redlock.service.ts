import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDLOCK_TOKEN } from './constants/redlock.constants';
import Redlock, { Lock } from 'redlock';

@Injectable()
export class RedlockService implements OnModuleDestroy {
  constructor(@Inject(REDLOCK_TOKEN) private readonly redlock: Redlock) {}

  async acquireLock(key: string, ttl: number): Promise<Lock> {
    return await this.redlock.acquire([key], ttl);
  }

  public async onModuleDestroy(): Promise<void> {
    await this.redlock.quit();
  }
}
