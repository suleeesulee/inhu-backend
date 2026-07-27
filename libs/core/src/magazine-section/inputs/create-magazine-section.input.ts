import { MagazineSectionParameter } from '../magazine-section-parameter.type';

/**
 * CreateMagazineSectionInput 클래스
 *
 * @publicApi
 */
export class CreateMagazineSectionInput {
  title: string;
  parameter: MagazineSectionParameter;
  sortOrder: number;
}
