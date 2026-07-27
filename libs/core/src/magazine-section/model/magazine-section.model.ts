import { MagazineSectionParameter } from '../magazine-section-parameter.type';
import { SelectMagazineSection } from './prisma-type/select-magazine-section';

/**
 * Magazine section 모델
 *
 * @publicApi
 */
export class MagazineSectionModel {
  public idx: number;
  public title: string;
  public parameter: MagazineSectionParameter;
  public sortOrder: number;
  public createdAt: Date;

  constructor(data: MagazineSectionModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    placeSection: SelectMagazineSection,
  ): MagazineSectionModel {
    return new MagazineSectionModel({
      idx: placeSection.idx,
      title: placeSection.title,
      parameter: placeSection.parameter as unknown as MagazineSectionParameter,
      sortOrder: placeSection.sortOrder,
      createdAt: placeSection.createdAt,
    });
  }
}
