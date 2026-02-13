export class CreateDimOperatingHourInput {
  idx: number;
  placeIdx: number;
  startAt: Date;
  endAt: Date;
  day: number;
  deletedAt: Date | null;
}
