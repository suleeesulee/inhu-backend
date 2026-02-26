export class CreateDimMagazineInput {
  idx: number;
  authorIdx: number;
  title: string;
  description: string | null;
  content: string;
  thumbnailImagePath: string | null;
  isTitleVisible: boolean;
  likeCount: number;
  viewCount: number;
  registeredAt: Date;
  activatedAt: Date | null;
  deletedAt: Date | null;
}
