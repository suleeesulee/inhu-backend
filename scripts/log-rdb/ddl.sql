CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE dim_break_times
(
  id          uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx         int                      NOT NULL,
  place_idx   int                      NOT NULL,
  start_at    time(6)                  NOT NULL,
  end_at      time(6)                  NOT NULL,
  day         smallint                 NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  valid_from  timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_break_times ADD CONSTRAINT uq_dim_break_times_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_break_times_valid_from ON dim_break_times(valid_from);

CREATE TABLE dim_closed_days
(
  id          uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx         int                      NOT NULL,
  place_idx   int                      NOT NULL,
  day         smallint                 NOT NULL,
  week        smallint                 NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  valid_from  timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_closed_days ADD CONSTRAINT uq_dim_closed_days_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_closed_days_valid_from ON dim_closed_days(valid_from);

CREATE TABLE dim_main_categories
(
  id            uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx           int                      NOT NULL,
  content       varchar                  NOT NULL,
  created_at    timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  registered_at timestamp with time zone NOT NULL,
  valid_from    timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_main_categories ADD CONSTRAINT uq_dim_main_categories_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_main_categories_valid_from ON dim_main_categories(valid_from);

CREATE TABLE dim_mood_categories
(
  id            uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx           int                      NOT NULL,
  content       varchar                  NOT NULL,
  created_at    timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  registered_at timestamp with time zone NOT NULL,
  valid_from    timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_mood_categories ADD CONSTRAINT uq_dim_mood_categories_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_mood_categories_valid_from ON dim_mood_categories(valid_from);

CREATE TABLE dim_operating_hours
(
  id          uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx         int                      NOT NULL,
  place_idx   int                      NOT NULL,
  start_at    time(6)                  NOT NULL,
  end_at      time(6)                  NOT NULL,
  day         smallint                 NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  valid_from  timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_operating_hours ADD CONSTRAINT uq_dim_operating_hours_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_operating_hours_valid_from ON dim_operating_hours(valid_from);

CREATE TABLE dim_place_images
(
  id            uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx           int                      NOT NULL,
  place_idx     int                      NOT NULL,
  image_path    varchar,
  created_at    timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  registered_at timestamp with time zone NOT NULL,
  valid_from    timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_place_images ADD CONSTRAINT uq_dim_place_images_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_place_images_valid_from ON dim_place_images(valid_from);

CREATE TABLE dim_place_main_category_mappings
(
  id                uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  main_category_idx int                      NOT NULL,
  place_idx         int                      NOT NULL,
  created_at        timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at        timestamp with time zone,
  valid_from        timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_place_main_category_mappings ADD CONSTRAINT uq_dim_place_main_category_mappings_idx_valid_from UNIQUE (main_category_idx, place_idx, valid_from);
CREATE INDEX index_dim_place_main_category_mappings_valid_from ON dim_place_main_category_mappings(valid_from);

CREATE TABLE dim_place_mood_category_mappings
(
  id                uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  mood_category_idx int                      NOT NULL,
  place_idx         int                      NOT NULL,
  created_at        timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at        timestamp with time zone,
  valid_from        timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_place_mood_category_mappings ADD CONSTRAINT uq_dim_place_mood_category_mappings_idx_valid_from UNIQUE (mood_category_idx, place_idx, valid_from);
CREATE INDEX index_dim_place_mood_category_mappings_valid_from ON dim_place_mood_category_mappings(valid_from);

CREATE TABLE dim_place_type_mappings
(
  id             uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  place_type_idx int                      NOT NULL,
  place_idx      int                      NOT NULL,
  created_at     timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at     timestamp with time zone,
  valid_from     timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_place_type_mappings ADD CONSTRAINT uq_dim_place_type_mappings_idx_valid_from UNIQUE (place_type_idx, place_idx, valid_from);
CREATE INDEX index_dim_place_type_mappings_valid_from ON dim_place_type_mappings(valid_from);

CREATE TABLE dim_place_types
(
  id            uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx           int                      NOT NULL,
  content       varchar                  NOT NULL,
  created_at    timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at    timestamp with time zone,
  registered_at timestamp with time zone NOT NULL,
  valid_from    timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_place_types ADD CONSTRAINT uq_dim_place_types_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_place_types_valid_from ON dim_place_types(valid_from);

CREATE TABLE dim_places
(
  id                    uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx                   int                      NOT NULL,
  road_address_idx      int                      NOT NULL,
  name                  varchar                  NOT NULL,
  tel                   varchar,
  review_count          int                      NOT NULL,
  bookmark_count        int                      NOT NULL,
  is_closed_on_holiday  boolean,
  created_at            timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at            timestamp with time zone,
  permanently_closed_at timestamp with time zone,
  activated_at          timestamp with time zone,
  registered_at         timestamp with time zone NOT NULL,
  valid_from            timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_places ADD CONSTRAINT uq_dim_places_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_places_valid_from ON dim_places(valid_from);

CREATE TABLE dim_road_addresses
(
  id             uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx            int                      NOT NULL,
  address_name   varchar                  NOT NULL,
  detail_address varchar,
  address_x      numeric                  NOT NULL,
  address_y      numeric                  NOT NULL,
  created_at     timestamp with time zone NOT NULL DEFAULT NOW(),
  valid_from     timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_road_addresses ADD CONSTRAINT uq_dim_road_addresses_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_road_addresses_valid_from ON dim_road_addresses(valid_from);

CREATE TABLE dim_user_providers
(
  id         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx        int                      NOT NULL,
  provider   varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  valid_from timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_user_providers ADD CONSTRAINT uq_dim_user_providers_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_user_providers_valid_from ON dim_user_providers(valid_from);

CREATE TABLE dim_users
(
  id                 uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx                int                      NOT NULL,
  nickname           varchar                  NOT NULL,
  profile_image_path varchar,
  signup_at          timestamp with time zone NOT NULL,
  platform           varchar                  NOT NULL,
  deleted_at         timestamp with time zone,
  created_at         timestamp with time zone NOT NULL DEFAULT NOW(),
  valid_from         timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_users ADD CONSTRAINT uq_dim_users_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_users_valid_from ON dim_users(valid_from);
COMMENT ON COLUMN dim_users.platform IS 'web, iOS, android, unknown';

CREATE TABLE dim_weekly_closed_days
(
  id          uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx         int                      NOT NULL,
  place_idx   int                      NOT NULL,
  closed_date date                     NOT NULL,
  type        smallint                 NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  valid_from  timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE dim_weekly_closed_days ADD CONSTRAINT uq_dim_weekly_closed_days_idx_valid_from UNIQUE (idx, valid_from);
CREATE INDEX index_dim_weekly_closed_days_valid_from ON dim_weekly_closed_days(valid_from);

CREATE TABLE event_types
(
  idx  int     NOT NULL,
  name varchar NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE fact_events
(
  id          uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  type_idx    int                      NOT NULL,
  user_idx    int,
  event_time  timestamp with time zone NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  device_type int                      NOT NULL,
  platform    int                      NOT NULL,
  PRIMARY KEY (id)
);
CREATE INDEX index_fact_type_idx ON fact_events(type_idx);
CREATE INDEX index_fact_event_time ON fact_events(event_time);
CREATE INDEX index_fact_user_idx ON fact_events(user_idx);

CREATE TABLE fact_event_properties
(
  id             uuid    NOT NULL DEFAULT uuid_generate_v4(),
  event_id       uuid    NOT NULL,
  property_key   varchar NOT NULL,
  property_value varchar NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fact_event_properties_event_id_key_uk UNIQUE (event_id, property_key)
);

ALTER TABLE fact_events
  ADD CONSTRAINT FK_event_types_TO_fact_events
    FOREIGN KEY (type_idx)
    REFERENCES event_types (idx);

ALTER TABLE fact_event_properties
  ADD CONSTRAINT FK_fact_events_TO_fact_event_properties
    FOREIGN KEY (event_id)
    REFERENCES fact_events (id);