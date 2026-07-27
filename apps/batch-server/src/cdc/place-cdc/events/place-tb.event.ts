export type PlaceTb = {
  idx: number;
  road_address_idx: number;
  name: string;
  tel: string | null;
  review_count: number;
  bookmark_count: number;
  is_closed_on_holiday: boolean | null;
  created_at: string;
  deleted_at: string | null;
  permanently_closed_at: string | null;
  activated_at: string | null;
};
