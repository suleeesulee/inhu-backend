import { PlaceSectionParameter } from '../place-section-parameter';
import { SelectPlaceSection } from './prisma-type/select-place-section';

/**
 * Place section 모델
 *
 * @publicApi
 */
export class PlaceSectionModel {
  public idx: number;
  public title: string;
  public parameter: PlaceSectionParameter;

  constructor(data: PlaceSectionModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    placeSection: SelectPlaceSection,
  ): PlaceSectionModel {
    return new PlaceSectionModel({
      idx: placeSection.idx,
      title: placeSection.title,
      parameter: placeSection.parameter as PlaceSectionParameter,
    });
  }
}
