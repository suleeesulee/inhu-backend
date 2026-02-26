export class CreateDimMenuInput {
  idx: number;
  placeIdx: number;
  name: string;
  content: string | null;
  price: number | null;
  imagePath: string | null;
  isFlexible: boolean;
  sortOrder: number;
  isMain: boolean;
  registeredAt: Date;
  deletedAt: Date | null;
}
