export type ReviewTb = {
  idx: number;
  user_idx: number;
  place_idx: number;
  content: string;
  is_menu_checked: boolean;
  created_at: string;
  deleted_at: string | null;
};
