import { PlaceSectionModel } from '@libs/core/place-section/model/place-section.model';
import { PlaceSectionParameter } from '@libs/core/place-section/place-section-parameter.type';
import { SectionPlaceOverviewEntity } from './section-place-overview.entity';

export class PlaceSectionEntity {
  /**
   * 섹션 고유 번호
   *
   * @example 1
   */
  idx: number;

  /**
   * 섹션 제목
   *
   * @example "인기 맛집"
   */
  title: string;

  /**
   * 섹션 파라미터
   */
  parameter: PlaceSectionParameter;

  /**
   * place overview list
   */
  placeOverviewList?: SectionPlaceOverviewEntity[];

  /**
   * 섹션 생성 일자
   */
  createdAt: Date;

  constructor(data: PlaceSectionEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceSectionModel,
    placeOverviewList?: SectionPlaceOverviewEntity[],
  ): PlaceSectionEntity {
    return new PlaceSectionEntity({
      idx: model.idx,
      title: model.title,
      parameter: model.parameter,
      placeOverviewList,
      createdAt: model.createdAt,
    });
  }
}
