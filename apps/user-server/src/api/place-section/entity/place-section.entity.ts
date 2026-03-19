import { PlaceSectionModel } from '@libs/core/place-section/model/place-section.model';
import { PlaceSectionParameter } from '@libs/core/place-section/place-section-parameter';

export class PlaceSectionEntity {
  idx: number;
  title: string;
  parameter: PlaceSectionParameter;
  createdAt: Date;

  constructor(data: PlaceSectionEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceSectionModel): PlaceSectionEntity {
    return new PlaceSectionEntity({
      idx: model.idx,
      title: model.title,
      parameter: model.parameter,
      createdAt: model.createdAt,
    });
  }
}
