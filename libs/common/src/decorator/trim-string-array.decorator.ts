import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * string[]의 각 요소 앞뒤 공백을 제거하는 데코레이터
 *
 * @decorator Property
 * @publicApi
 */
export function TrimStringArray() {
  return applyDecorators(
    Transform(({ value }) => value.map((item: string) => item.trim())),
  );
}
