import { SelectSearchTag } from './prisma-type/select-search-tag';

export class SearchTagModel {
  public idx: number;
  public content: string;
  public createdAt: Date;

  constructor(data: SearchTagModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(freeTag: SelectSearchTag): SearchTagModel {
    return new SearchTagModel({
      idx: freeTag.idx,
      content: freeTag.content,
      createdAt: freeTag.createdAt,
    });
  }
}
