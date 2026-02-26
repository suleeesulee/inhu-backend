export type MagazineTb = {
  idx: number;
  author_idx: number;
  title: string;
  description: string | null;
  content: string;
  thumbnail_image_path: string | null;
  is_title_visible: boolean;
  like_count: number;
  view_count: number;
  created_at: string;
  activated_at: string | null;
  deleted_at: string | null;
};
