import { SelectCafeteria } from './prisma-type/select-cafeteria';

export class CafeteriaModel {
  public idx: number;
  public name: string;
  public createdAt: Date;

  constructor(data: CafeteriaModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(cafeteria: SelectCafeteria): CafeteriaModel {
    return new CafeteriaModel({
      idx: cafeteria.idx,
      name: cafeteria.name,
      createdAt: cafeteria.createdAt,
    });
  }
}
