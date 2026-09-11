export class GetPlaceVisitAllInput {
  take: number;
  skip: number;
  order?: 'asc' | 'desc';
  placeIdx?: number;
  userIdx?: number;
}
