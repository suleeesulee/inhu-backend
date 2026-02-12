export class CreateDimPlaceInput {
  idx: number;
  roadAddressIdx: number;
  name: string;
  tel: string | null;
  reviewCount: number;
  bookmarkCount: number;
  isClosedOnHoliday: boolean | null;
  deletedAt: Date | null;
  permanentlyClosedAt: Date | null;
  activatedAt: Date | null;
  registeredAt: Date;
}
