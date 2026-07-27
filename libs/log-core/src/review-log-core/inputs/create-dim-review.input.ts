export class CreateDimReviewInput {
  idx: number;
  userIdx: number;
  placeIdx: number;
  content: string;
  isMenuChecked: boolean;
  registeredAt: Date;
  deletedAt: Date | null;
}
