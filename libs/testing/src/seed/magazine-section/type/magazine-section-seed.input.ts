import { MagazineSectionParameter } from '@libs/core/magazine-section/magazine-section-parameter.type';

/**
 * magazine section 시드 입력 타입 정의
 *
 * @publicApi
 */
export type MagazineSectionSeedInput = {
  title?: string;
  parameter?: MagazineSectionParameter;
  deletedAt?: Date | null;
};
