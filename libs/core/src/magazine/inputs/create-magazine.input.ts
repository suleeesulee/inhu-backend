/**
 * @publicApi
 */
export class CreateMagazineInput {
  authorIdx: number;
  title: string;
  description: string | null;
  content: string;
  thumbnailImagePath: string | null;
  isTitleVisible: boolean;
  placeIdxList: number[] | null;
}
