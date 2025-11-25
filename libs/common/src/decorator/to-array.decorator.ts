import { Transform } from 'class-transformer';

/**
 * 전달된 값을 array로 형변환하는 프로퍼티 데코레이터.
 * querystring으로 전달되는 dto에 사용하기를 기대합니다.
 *
 * @author 이수인
 *
 * @decorator Property
 * @publicApi
 */
export const ToArray = () => {
  return Transform(({ value }) => {
    return Array.isArray(value) ? value : value !== undefined ? [value] : [];
  });
};
