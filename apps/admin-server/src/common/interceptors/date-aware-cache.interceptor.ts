import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

/**
 * 요청 날짜를 캐시 키에 포함시키는 인터셉터.
 * 날짜가 바뀌면 키가 달라져 자동으로 cache miss가 발생합니다.
 */
@Injectable()
export class DateAwareCacheInterceptor extends CacheInterceptor {
  protected override trackBy(context: ExecutionContext): string | undefined {
    const baseKey = super.trackBy(context);
    if (!baseKey) return undefined;

    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    return `${baseKey}:${today}`;
  }
}
