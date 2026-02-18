import { SelectFreeTag } from './prisma-type/select-free-tag';

export class FreeTagModel {
  public idx: number;
  public content: string;
  public createdAt: Date;

  constructor(data: FreeTagModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(freeTag: SelectFreeTag): FreeTagModel {
    return new FreeTagModel({
      idx: freeTag.idx,
      content: freeTag.content,
      createdAt: freeTag.createdAt,
    });
  }
}
