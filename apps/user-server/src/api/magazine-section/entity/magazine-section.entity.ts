import { MagazineSectionModel } from '@libs/core/magazine-section/model/magazine-section.model';
import { MagazineSectionParameter } from '@libs/core/magazine-section/magazine-section-parameter.type';

export class MagazineSectionEntity {
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
  parameter: MagazineSectionParameter;

  /**
   * 섹션 생성 일자
   */
  createdAt: Date;

  constructor(data: MagazineSectionEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: MagazineSectionModel): MagazineSectionEntity {
    return new MagazineSectionEntity({
      idx: model.idx,
      title: model.title,
      parameter: model.parameter,
      createdAt: model.createdAt,
    });
  }
}
