import { SearchTagModel } from '@libs/core/search-tag/model/search-tag.model';

export class SearchTagEntity {
  /**
   * search tag idx
   *
   * @example 1
   */
  public idx: number;

  /**
   * search tag name
   *
   * @example '가성비 좋은'
   */
  public name: string;

  constructor(data: SearchTagEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: SearchTagModel): SearchTagEntity {
    return new SearchTagEntity({
      idx: model.idx,
      name: model.content,
    });
  }
}
