export type MenuTb = {
  idx: number;
  place_idx: number;
  name: string;
  content: string | null;
  price: number | null;
  image_path: string | null;
  is_flexible: boolean;
  sort_order: number;
  is_main: boolean;
  created_at: string;
  deleted_at: string | null;
};
