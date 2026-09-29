CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE bookmark_tb
(
  user_idx   int                      NOT NULL,
  place_idx  int                      NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_idx, place_idx)
);

CREATE TABLE break_time_tb
(
  idx       int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx int      NOT NULL,
  start_at  time(6)  NOT NULL,
  end_at    time(6)  NOT NULL,
  day       smallint NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE cafeteria_bookmark_tb
(
  user_idx      int                      NOT NULL,
  cafeteria_idx int                      NOT NULL,
  created_at    timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  PRIMARY KEY (user_idx, cafeteria_idx)
);

CREATE TABLE cafeteria_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name       varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE closed_day_tb
(
  idx       int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx int      NOT NULL,
  day       smallint NOT NULL,
  week      smallint NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE daily_memo_tb
(
  idx           int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  cafeteria_idx int                      NOT NULL,
  content       varchar                  NOT NULL,
  date          date                     NOT NULL,
  created_at    timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE food_station_tb
(
  idx           int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  cafeteria_idx int                      NOT NULL,
  meal_type_idx int                      NOT NULL,
  name          varchar                  ,
  start_time    time(6)                  NOT NULL,
  end_time      time(6)                  NOT NULL,
  start_date    date                     NOT NULL,
  end_date      date                     NOT NULL,
  created_at    timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  PRIMARY KEY (idx)
);
CREATE INDEX idx_food_station_cafeteria_date 
  ON food_station_tb (cafeteria_idx, start_date, end_date)
  WHERE deleted_at IS NULL;

CREATE TABLE free_tag_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);
CREATE INDEX index_free_tag_content_active
  ON free_tag_tb (content)
  WHERE deleted_at IS NULL;
CREATE INDEX index_free_tag_content_like_active
  ON free_tag_tb (content text_pattern_ops)
  WHERE deleted_at IS NULL;

CREATE TABLE installation_tb
(
  id                       uuid                     NOT NULL,
  user_idx                 int                     ,
  platform                 varchar                  NOT NULL,
  app_version              varchar                  NOT NULL,
  refresh_token_expires_at timestamp with time zone,
  updated_at               timestamp with time zone NOT NULL DEFAULT NOW(),
  created_at               timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

COMMENT ON COLUMN installation_tb.platform IS 'ios / android';

CREATE TABLE keyword_tb
(
  idx        int                      NOT NULL,
  content    varchar                  NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE league_season_result_tb
(
  id                uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  league_season_idx int                      NOT NULL,
  user_idx          int                      NOT NULL,
  final_score       int                      NOT NULL,
  created_at        timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE INDEX idx_league_season_result_season_score
  ON league_season_result_tb (league_season_idx, final_score DESC, user_idx);
CREATE INDEX idx_league_season_result_user_created
  ON league_season_result_tb (user_idx, created_at DESC);

CREATE TABLE league_season_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name         varchar                  NOT NULL,
  start_at     timestamp with time zone NOT NULL,
  end_at       timestamp with time zone NOT NULL,
  activated_at timestamp with time zone,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  finalized_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE INDEX idx_league_season_unfinalized_end
  ON league_season_tb (end_at)
  WHERE finalized_at IS NULL;

CREATE INDEX idx_league_season_activated_start
  ON league_season_tb (start_at DESC, idx DESC)
  WHERE activated_at IS NOT NULL;

CREATE TABLE magazine_like_tb
(
  magazine_idx int                      NOT NULL,
  user_idx     int                      NOT NULL,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (magazine_idx, user_idx)
);

CREATE TABLE magazine_main_category_mapping_tb
(
  main_category_idx int NOT NULL,
  magazine_idx      int NOT NULL,
  PRIMARY KEY (main_category_idx, magazine_idx)
);

CREATE TABLE magazine_mood_category_mapping_tb
(
  mood_category_idx int NOT NULL,
  magazine_idx      int NOT NULL,
  PRIMARY KEY (mood_category_idx, magazine_idx)
);

CREATE TABLE magazine_place_tb
(
  magazine_idx int NOT NULL,
  place_idx    int NOT NULL,
  PRIMARY KEY (magazine_idx, place_idx)
);

CREATE TABLE magazine_section_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  title        varchar                  NOT NULL,
  parameter    jsonb                    NOT NULL,
  sort_order   smallint                 NOT NULL,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  activated_at timestamp with time zone,
  deleted_at   timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE magazine_tb
(
  idx                  int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  author_idx           int                      NOT NULL,
  title                varchar                  NOT NULL,
  description          varchar                 ,
  content              varchar                  NOT NULL,
  thumbnail_image_path varchar                  ,
  is_title_visible     boolean                  NOT NULL DEFAULT false,
  like_count           int                      NOT NULL DEFAULT 0,
  view_count           int                      NOT NULL DEFAULT 0,
  created_at           timestamp with time zone NOT NULL DEFAULT NOW(),
  activated_at         timestamp with time zone,
  deleted_at           timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE main_category_tb
(
  idx        int                      NOT NULL,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE meal_item_tb
(
  idx               int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  meal_offering_idx int                      NOT NULL,
  name              varchar                  NOT NULL,
  price             int                     ,
  created_at        timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE meal_offering_tb
(
  idx              int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  food_station_idx int                      NOT NULL,
  start_time       time(6)                  NOT NULL,
  end_time         time(6)                  NOT NULL,
  kcal             int                     ,
  served_date      date                     NOT NULL,
  created_at       timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE meal_type_tb
(
  idx        int                      NOT NULL,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE menu_review_tb
(
  menu_idx   int NOT NULL,
  review_idx int NOT NULL,
  PRIMARY KEY (menu_idx, review_idx)
);

CREATE TABLE menu_tb
(
  idx         int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx   int                      NOT NULL,
  name        varchar                  NOT NULL,
  content     varchar                 ,
  price       int                     ,
  image_path  varchar                 ,
  is_flexible boolean                  NOT NULL DEFAULT false,
  sort_order  smallint                 NOT NULL,
  is_main     boolean                  NOT NULL DEFAULT true,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE mood_category_tb
(
  idx        int                      NOT NULL,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE nfc_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx    int                      NOT NULL,
  score        int                      NOT NULL,
  uid          varchar                  NOT NULL,
  cooldown     int                      ,
  activated_at timestamp with time zone,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at   timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE INDEX idx_nfc_place_deleted
  ON nfc_tb (place_idx, deleted_at);

CREATE TABLE notice_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  author_idx int                      NOT NULL,
  title      varchar                  NOT NULL,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE notification_campaign_tb
(
  id              uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  notification_id uuid                     NOT NULL,
  target_count    int                      NOT NULL,
  success_count   int                      NOT NULL,
  fail_count      int                      NOT NULL,
  completed_at    timestamp with time zone,
  created_at      timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE INDEX idx_notification_campaign_notification_created_at
ON notification_campaign_tb (
  notification_id,
  created_at DESC
);
CREATE INDEX idx_notification_campaign_incomplete
ON notification_campaign_tb (
  created_at
)
WHERE completed_at IS NULL;

CREATE TABLE notification_tb
(
  id         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  title      varchar                  NOT NULL,
  content    varchar                  NOT NULL,
  page_type  int                      NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE INDEX idx_notification_created_at_id
ON notification_tb (
  created_at DESC,
  id DESC
);

CREATE TABLE operating_hour_tb
(
  idx       int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx int      NOT NULL,
  start_at  time(6)  NOT NULL,
  end_at    time(6)  NOT NULL,
  day       smallint NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE picked_place_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx  int                      NOT NULL UNIQUE,
  title      varchar                  NOT NULL,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_image_tb
(
  idx        int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx  int     NOT NULL,
  image_path varchar NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_keyword_count_tb
(
  place_idx   int NOT NULL,
  keyword_idx int NOT NULL,
  count       int NOT NULL DEFAULT 0,
  PRIMARY KEY (place_idx, keyword_idx)
);

CREATE TABLE place_main_category_mapping_tb
(
  main_category_idx int NOT NULL,
  place_idx         int NOT NULL,
  PRIMARY KEY (main_category_idx, place_idx)
);

CREATE TABLE place_mood_category_mapping_tb
(
  mood_category_idx int NOT NULL,
  place_idx         int NOT NULL,
  PRIMARY KEY (mood_category_idx, place_idx)
);

CREATE TABLE place_search_tag_mapping_tb
(
  search_tag_idx int NOT NULL,
  place_idx      int NOT NULL,
  PRIMARY KEY (search_tag_idx, place_idx)
);

CREATE TABLE place_section_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  title        varchar                  NOT NULL,
  parameter    jsonb                    NOT NULL,
  sort_order   smallint                 NOT NULL,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  activated_at timestamp with time zone,
  deleted_at   timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_tb
(
  idx                   int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name                  varchar                  NOT NULL,
  tel                   varchar                  ,
  review_count          int                      NOT NULL DEFAULT 0,
  bookmark_count        int                      NOT NULL DEFAULT 0,
  road_address_idx      int                      NOT NULL,
  is_closed_on_holiday  boolean                  ,
  priority              smallint                 NULL,
  created_at            timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at            timestamp with time zone,
  permanently_closed_at timestamp with time zone,
  activated_at          timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE pinned_magazine_tb
(
  idx        int                      NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE place_free_tag_mapping_tb
(
  free_tag_idx int NOT NULL,
  place_idx    int NOT NULL,
  PRIMARY KEY (free_tag_idx, place_idx)
);

CREATE TABLE place_type_magazine_mapping_tb
(
  place_type_idx int NOT NULL,
  magazine_idx   int NOT NULL,
  PRIMARY KEY (place_type_idx, magazine_idx)
);

CREATE TABLE place_type_mapping_tb
(
  place_type_idx int NOT NULL,
  place_idx      int NOT NULL,
  PRIMARY KEY (place_type_idx, place_idx)
);

CREATE TABLE place_type_tb
(
  idx        int                      NOT NULL,
  content    varchar                  NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_visit_tb
(
  id         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  user_idx   int                      NOT NULL,
  nfc_idx    int                      NOT NULL,
  score      int                      NOT NULL,
  latitude   numeric                  NOT NULL,
  longitude  numeric                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (id)
);

CREATE INDEX idx_place_visit_created_user
  ON place_visit_tb (created_at, user_idx);
CREATE INDEX idx_place_visit_user_created
  ON place_visit_tb (user_idx, created_at DESC);
CREATE INDEX idx_place_visit_nfc_created
  ON place_visit_tb (nfc_idx, created_at DESC);

CREATE TABLE push_token_tb
(
  id              uuid                     NOT NULL,
  expo_push_token varchar                  NOT NULL,
  last_seen_at    timestamp with time zone NOT NULL DEFAULT NOW(),
  created_at      timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

COMMENT ON COLUMN push_token_tb.last_seen_at IS 'push token을 마지막으로 갱신한 시점';

CREATE TABLE review_image_tb
(
  idx        int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  review_idx int     NOT NULL,
  image_path varchar NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE league_reward_option_tb
(
  id                uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  league_season_idx int                      NOT NULL,
  reward_idx        int                      NOT NULL,
  target_rank       int                      NOT NULL,
  created_at        timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at        timestamp with time zone,
  PRIMARY KEY (id)
);

CREATE INDEX idx_league_reward_option_reward
  ON league_reward_option_tb (reward_idx);

CREATE TABLE reward_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name         varchar                  NOT NULL,
  image_path   varchar                 ,
  activated_at timestamp with time zone,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at   timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE review_keyword_mapping_tb
(
  review_idx  int NOT NULL,
  keyword_idx int NOT NULL,
  PRIMARY KEY (review_idx, keyword_idx)
);

CREATE TABLE review_tb
(
  idx             int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx        int                      NOT NULL,
  place_idx       int                      NOT NULL,
  content         varchar                  NOT NULL,
  is_menu_checked boolean                  NOT NULL DEFAULT false,
  created_at      timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at      timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE road_address_tb
(
  idx            int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  address_name   varchar NOT NULL,
  detail_address varchar,
  address_x      numeric NOT NULL,
  address_y      numeric NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE search_tag_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);
CREATE INDEX index_search_tag_content_active
  ON search_tag_tb (content)
  WHERE deleted_at IS NULL;
CREATE INDEX index_search_tag_content_like_active
  ON search_tag_tb (content text_pattern_ops)
  WHERE deleted_at IS NULL;

CREATE TABLE service1_result_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx     int                      NOT NULL,
  service1_idx int                      NOT NULL,
  content      varchar                 ,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE service1_tb
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

CREATE TABLE service2_result_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx     int                      NOT NULL,
  service2_idx int                      NOT NULL,
  content      varchar                 ,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE service2_tb
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

CREATE TABLE user_email_tb
(
  idx                    int                      NOT NULL,
  school_email_encrypted varchar                  NOT NULL,
  school_email_hash      varchar                  NOT NULL,
  created_at             timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE login_user_notification_tb
(
  notification_id uuid                     NOT NULL,
  user_idx        int                      NOT NULL,
  created_at      timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (notification_id, user_idx)
);

CREATE INDEX idx_login_user_notification_user_created_at_notification
ON login_user_notification_tb (
  user_idx,
  created_at DESC,
  notification_id
);

CREATE TABLE user_provider_tb
(
  idx    int     NOT NULL,
  name   varchar NOT NULL,
  sns_id varchar NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE user_reward_tb
(
  id                      uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  reward_idx              int                      ,
  league_season_result_id uuid                     NOT NULL,
  created_at              timestamp with time zone NOT NULL DEFAULT NOW(),
  selected_at             timestamp with time zone,
  issued_at               timestamp with time zone,
  PRIMARY KEY (id)
);

CREATE INDEX idx_user_reward_reward
  ON user_reward_tb (reward_idx);

CREATE TABLE user_tb
(
  idx                    int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  nickname               varchar                  NOT NULL,
  profile_image_path     varchar                 ,
  platform               varchar                  NOT NULL DEFAULT 'unknown',
  created_at             timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at             timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE admin_account_tb
(
  idx        int                      NOT NULL,
  id         varchar                  NOT NULL,
  pw         varchar                  NOT NULL,
  role       varchar                  NOT NULL DEFAULT 'ADMIN',
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE weekly_closed_day_tb
(
  idx         int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx   int      NOT NULL,
  closed_date date     NOT NULL,
  type        smallint NOT NULL DEFAULT 0,
  PRIMARY KEY (idx)
);

CREATE TABLE withdraw_service_result_tb
(
  idx                  int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx             int                      NOT NULL,
  withdraw_service_idx int                      NOT NULL,
  created_at           timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE withdraw_service_tb
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

CREATE TABLE place_owner_tb
(
  id         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  place_idx  int                      NOT NULL,
  user_idx   int                      NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (id)
);

CREATE TABLE blog_review_tb
(
  idx                       int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx                 int                      NOT NULL,
  blog_name                 varchar                  NOT NULL,
  title                     varchar                  NOT NULL,
  description               varchar                 ,
  contents                  varchar                 ,
  author_name               varchar                  NOT NULL,
  author_profile_image_path varchar                 ,
  thumbnail_image_path      varchar                 ,
  url                       varchar                  NOT NULL,
  blog_type                 smallint                 NOT NULL DEFAULT 0,
  created_at                timestamp with time zone NOT NULL DEFAULT NOW(),
  uploaded_at               timestamp with time zone NOT NULL,
  deleted_at                timestamp with time zone,
  PRIMARY KEY (idx)
);

-- kafka delete event 처리를 위한 REPLICA IDENTITY 설정
-- 삭제 시 REPLICA IDENTITY가 DEFAULT인 경우, 삭제된 행의 전체 데이터를 가져올 수 없고, PK값만 가져올 수 있음.
-- 따라서, 삭제된 행의 전체 데이터를 가져오기 위해 REPLICA IDENTITY를 FULL로 설정함.
ALTER TABLE review_image_tb REPLICA IDENTITY FULL;
ALTER TABLE pinned_magazine_tb REPLICA IDENTITY FULL;
ALTER TABLE magazine_like_tb REPLICA IDENTITY FULL;
ALTER TABLE closed_day_tb REPLICA IDENTITY FULL;
ALTER TABLE operating_hour_tb REPLICA IDENTITY FULL;
ALTER TABLE weekly_closed_day_tb REPLICA IDENTITY FULL;
ALTER TABLE break_time_tb REPLICA IDENTITY FULL;

ALTER TABLE review_image_tb
  ADD CONSTRAINT FK_review_tb_TO_review_image_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE review_keyword_mapping_tb
  ADD CONSTRAINT FK_review_tb_TO_review_keyword_mapping_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE review_keyword_mapping_tb
  ADD CONSTRAINT FK_keyword_tb_TO_review_keyword_mapping_tb
    FOREIGN KEY (keyword_idx)
    REFERENCES keyword_tb (idx);

ALTER TABLE review_tb
  ADD CONSTRAINT FK_user_tb_TO_review_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE bookmark_tb
  ADD CONSTRAINT FK_user_tb_TO_bookmark_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE place_type_mapping_tb
  ADD CONSTRAINT FK_place_type_tb_TO_place_type_mapping_tb
    FOREIGN KEY (place_type_idx)
    REFERENCES place_type_tb (idx);

ALTER TABLE service1_result_tb
  ADD CONSTRAINT FK_user_tb_TO_service1_result_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE service1_result_tb
  ADD CONSTRAINT FK_service1_tb_TO_service1_result_tb
    FOREIGN KEY (service1_idx)
    REFERENCES service1_tb (idx);

ALTER TABLE service2_result_tb
  ADD CONSTRAINT FK_user_tb_TO_service2_result_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE service2_result_tb
  ADD CONSTRAINT FK_service2_tb_TO_service2_result_tb
    FOREIGN KEY (service2_idx)
    REFERENCES service2_tb (idx);

ALTER TABLE withdraw_service_result_tb
  ADD CONSTRAINT FK_user_tb_TO_withdraw_service_result_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE withdraw_service_result_tb
  ADD CONSTRAINT FK_withdraw_service_tb_TO_withdraw_service_result_tb
    FOREIGN KEY (withdraw_service_idx)
    REFERENCES withdraw_service_tb (idx);

ALTER TABLE user_provider_tb
  ADD CONSTRAINT FK_user_tb_TO_user_provider_tb
    FOREIGN KEY (idx)
    REFERENCES user_tb (idx);

ALTER TABLE bookmark_tb
  ADD CONSTRAINT FK_place_tb_TO_bookmark_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE review_tb
  ADD CONSTRAINT FK_place_tb_TO_review_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_type_mapping_tb
  ADD CONSTRAINT FK_place_tb_TO_place_type_mapping_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_image_tb
  ADD CONSTRAINT FK_place_tb_TO_place_image_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE menu_tb
  ADD CONSTRAINT FK_place_tb_TO_menu_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE closed_day_tb
  ADD CONSTRAINT FK_place_tb_TO_closed_day_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE picked_place_tb
  ADD CONSTRAINT FK_place_tb_TO_picked_place_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE operating_hour_tb
  ADD CONSTRAINT FK_place_tb_TO_operating_hour_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE break_time_tb
  ADD CONSTRAINT FK_place_tb_TO_break_time_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE weekly_closed_day_tb
  ADD CONSTRAINT FK_place_tb_TO_weekly_closed_day_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_keyword_count_tb
  ADD CONSTRAINT FK_place_tb_TO_place_keyword_count_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_keyword_count_tb
  ADD CONSTRAINT FK_keyword_tb_TO_place_keyword_count_tb
    FOREIGN KEY (keyword_idx)
    REFERENCES keyword_tb (idx);

ALTER TABLE place_tb
  ADD CONSTRAINT FK_road_address_tb_TO_place_tb
    FOREIGN KEY (road_address_idx)
    REFERENCES road_address_tb (idx);

ALTER TABLE admin_account_tb
  ADD CONSTRAINT FK_user_tb_TO_admin_tb
    FOREIGN KEY (idx)
    REFERENCES user_tb (idx);

ALTER TABLE place_owner_tb
  ADD CONSTRAINT FK_place_tb_TO_place_owner_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_owner_tb
  ADD CONSTRAINT FK_user_tb_TO_place_owner_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE blog_review_tb
  ADD CONSTRAINT FK_place_tb_TO_blog_review_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);
    
ALTER TABLE menu_review_tb
  ADD CONSTRAINT FK_menu_tb_TO_menu_review_mapping_tb
    FOREIGN KEY (menu_idx)
    REFERENCES menu_tb (idx);

ALTER TABLE menu_review_tb
  ADD CONSTRAINT FK_review_tb_TO_menu_review_mapping_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE magazine_place_tb
  ADD CONSTRAINT FK_magazine_tb_TO_magazine_place_tb
    FOREIGN KEY (magazine_idx)
    REFERENCES magazine_tb (idx);

ALTER TABLE magazine_place_tb
  ADD CONSTRAINT FK_place_tb_TO_magazine_place_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE magazine_like_tb
  ADD CONSTRAINT FK_magazine_tb_TO_magazine_like_tb
    FOREIGN KEY (magazine_idx)
    REFERENCES magazine_tb (idx);

ALTER TABLE magazine_like_tb
  ADD CONSTRAINT FK_user_tb_TO_magazine_like_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE pinned_magazine_tb
  ADD CONSTRAINT FK_magazine_tb_TO_pinned_magazine_tb
    FOREIGN KEY (idx)
    REFERENCES magazine_tb (idx);

ALTER TABLE place_main_category_mapping_tb
  ADD CONSTRAINT FK_main_category_tb_TO_place_main_category_mapping_tb
    FOREIGN KEY (main_category_idx)
    REFERENCES main_category_tb (idx);

ALTER TABLE place_main_category_mapping_tb
  ADD CONSTRAINT FK_place_tb_TO_place_main_category_mapping_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_mood_category_mapping_tb
  ADD CONSTRAINT FK_mood_category_tb_TO_place_mood_category_mapping_tb
    FOREIGN KEY (mood_category_idx)
    REFERENCES mood_category_tb (idx);

ALTER TABLE place_mood_category_mapping_tb
  ADD CONSTRAINT FK_place_tb_TO_place_mood_category_mapping_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_type_magazine_mapping_tb
  ADD CONSTRAINT FK_place_type_tb_TO_place_type_magazine_mapping_tb
    FOREIGN KEY (place_type_idx)
    REFERENCES place_type_tb (idx);

ALTER TABLE place_type_magazine_mapping_tb
  ADD CONSTRAINT FK_magazine_tb_TO_place_type_magazine_mapping_tb
    FOREIGN KEY (magazine_idx)
    REFERENCES magazine_tb (idx);

ALTER TABLE magazine_main_category_mapping_tb
  ADD CONSTRAINT FK_main_category_tb_TO_magazine_main_category_mapping_tb
    FOREIGN KEY (main_category_idx)
    REFERENCES main_category_tb (idx);

ALTER TABLE magazine_main_category_mapping_tb
  ADD CONSTRAINT FK_magazine_tb_TO_magazine_main_category_mapping_tb
    FOREIGN KEY (magazine_idx)
    REFERENCES magazine_tb (idx);

ALTER TABLE magazine_mood_category_mapping_tb
  ADD CONSTRAINT FK_mood_category_tb_TO_magazine_mood_category_mapping_tb
    FOREIGN KEY (mood_category_idx)
    REFERENCES mood_category_tb (idx);

ALTER TABLE magazine_mood_category_mapping_tb
  ADD CONSTRAINT FK_magazine_tb_TO_magazine_mood_category_mapping_tb
    FOREIGN KEY (magazine_idx)
    REFERENCES magazine_tb (idx);

ALTER TABLE place_free_tag_mapping_tb
  ADD CONSTRAINT FK_free_tag_tb_TO_place_free_tag_mapping_tb
    FOREIGN KEY (free_tag_idx)
    REFERENCES free_tag_tb (idx);

ALTER TABLE place_free_tag_mapping_tb
  ADD CONSTRAINT FK_place_tb_TO_place_free_tag_mapping_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_search_tag_mapping_tb
  ADD CONSTRAINT FK_search_tag_tb_TO_place_search_tag_mapping_tb
    FOREIGN KEY (search_tag_idx)
    REFERENCES search_tag_tb (idx);

ALTER TABLE place_search_tag_mapping_tb
  ADD CONSTRAINT FK_place_tb_TO_place_search_tag_mapping_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE magazine_tb
  ADD CONSTRAINT FK_user_tb_TO_magazine_tb
    FOREIGN KEY (author_idx)
    REFERENCES user_tb (idx);

ALTER TABLE food_station_tb
  ADD CONSTRAINT FK_cafeteria_tb_TO_food_station_tb
    FOREIGN KEY (cafeteria_idx)
    REFERENCES cafeteria_tb (idx);

ALTER TABLE meal_offering_tb
  ADD CONSTRAINT FK_food_station_tb_TO_meal_offering_tb
    FOREIGN KEY (food_station_idx)
    REFERENCES food_station_tb (idx);

ALTER TABLE daily_memo_tb
  ADD CONSTRAINT FK_cafeteria_tb_TO_daily_memo_tb
    FOREIGN KEY (cafeteria_idx)
    REFERENCES cafeteria_tb (idx);

ALTER TABLE cafeteria_bookmark_tb
  ADD CONSTRAINT FK_user_tb_TO_cafeteria_bookmark_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE cafeteria_bookmark_tb
  ADD CONSTRAINT FK_cafeteria_tb_TO_cafeteria_bookmark_tb
    FOREIGN KEY (cafeteria_idx)
    REFERENCES cafeteria_tb (idx);

ALTER TABLE meal_item_tb
  ADD CONSTRAINT FK_meal_offering_tb_TO_meal_item_tb
    FOREIGN KEY (meal_offering_idx)
    REFERENCES meal_offering_tb (idx);

ALTER TABLE food_station_tb
  ADD CONSTRAINT FK_meal_type_tb_TO_food_station_tb
    FOREIGN KEY (meal_type_idx)
    REFERENCES meal_type_tb (idx);

ALTER TABLE nfc_tb
  ADD CONSTRAINT FK_place_tb_TO_nfc_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_visit_tb
  ADD CONSTRAINT FK_user_tb_TO_place_visit_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE league_season_result_tb
  ADD CONSTRAINT FK_league_season_tb_TO_league_season_result_tb
    FOREIGN KEY (league_season_idx)
    REFERENCES league_season_tb (idx);

ALTER TABLE league_season_result_tb
  ADD CONSTRAINT FK_user_tb_TO_league_season_result_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE user_reward_tb
  ADD CONSTRAINT FK_league_season_result_tb_TO_user_reward_tb
    FOREIGN KEY (league_season_result_id)
    REFERENCES league_season_result_tb (id);

ALTER TABLE league_reward_option_tb
  ADD CONSTRAINT FK_league_season_tb_TO_league_reward_option_tb
    FOREIGN KEY (league_season_idx)
    REFERENCES league_season_tb (idx);

ALTER TABLE league_reward_option_tb
  ADD CONSTRAINT FK_reward_tb_TO_league_reward_option_tb
    FOREIGN KEY (reward_idx)
    REFERENCES reward_tb (idx);

ALTER TABLE place_visit_tb
  ADD CONSTRAINT FK_nfc_tb_TO_place_visit_tb
    FOREIGN KEY (nfc_idx)
    REFERENCES nfc_tb (idx);

ALTER TABLE user_reward_tb
  ADD CONSTRAINT FK_reward_tb_TO_user_reward_tb
    FOREIGN KEY (reward_idx)
    REFERENCES reward_tb (idx);

ALTER TABLE user_email_tb
  ADD CONSTRAINT FK_user_tb_TO_user_email_tb
    FOREIGN KEY (idx)
    REFERENCES user_tb (idx);

ALTER TABLE installation_tb
  ADD CONSTRAINT FK_user_tb_TO_installation_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE push_token_tb
  ADD CONSTRAINT FK_installation_tb_TO_push_token_tb
    FOREIGN KEY (id)
    REFERENCES installation_tb (id);

ALTER TABLE notice_tb
  ADD CONSTRAINT FK_user_tb_TO_notice_tb
    FOREIGN KEY (author_idx)
    REFERENCES user_tb (idx);

ALTER TABLE login_user_notification_tb
  ADD CONSTRAINT FK_notification_tb_TO_login_user_notification_tb
    FOREIGN KEY (notification_id)
    REFERENCES notification_tb (id);

ALTER TABLE login_user_notification_tb
  ADD CONSTRAINT FK_user_tb_TO_login_user_notification_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE notification_campaign_tb
  ADD CONSTRAINT FK_notification_tb_TO_notification_campaign_tb
    FOREIGN KEY (notification_id)
    REFERENCES notification_tb (id);
