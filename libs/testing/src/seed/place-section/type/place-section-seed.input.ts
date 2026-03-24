import { PlaceSectionParameter } from '@libs/core/place-section/place-section-parameter.type';

/**
 * place section 시드 입력 타입 정의
 *
 * @publicApi
 */
export type PlaceSectionSeedInput = {
  title?: string;
  parameter?: PlaceSectionParameter;
  deletedAt?: Date | null;
};
