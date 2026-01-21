CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE dim_users
(
  id                 uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  idx                int                      NOT NULL,
  nickname           varchar                  NOT NULL,
  profile_image_path varchar                 ,
  signup_at          timestamp with time zone NOT NULL,
  platform           varchar                  NOT NULL,
  deleted_at         timestamp with time zone,
  created_at         timestamp with time zone NOT NULL DEFAULT NOW(),
  valid_from         timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);
CREATE INDEX index_dim_users_valid_from_index ON dim_users(valid_from);
ALTER TABLE dim_users ADD CONSTRAINT uq_dim_users_idx_valid_from UNIQUE (idx, valid_from);
COMMENT ON COLUMN dim_users.platform IS 'web, iOS, android, unknown';


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
CREATE INDEX index_dim_user_providers_idx_valid_from ON dim_user_providers(idx, valid_from);


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
  user_idx    int                     ,
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
  id       uuid    NOT NULL DEFAULT uuid_generate_v4(),
  event_id uuid    NOT NULL,
  property_key      varchar NOT NULL,
  property_value    varchar NOT NULL,
  PRIMARY KEY (id),

  CONSTRAINT fact_event_properties_event_id_key_uk
    UNIQUE (event_id, property_key)
);


ALTER TABLE fact_events
  ADD CONSTRAINT FK_event_types_TO_fact_events
    FOREIGN KEY (type_idx)
    REFERENCES event_types (idx);

ALTER TABLE fact_event_properties
  ADD CONSTRAINT FK_fact_events_TO_fact_event_properties
    FOREIGN KEY (event_id)
    REFERENCES fact_events (id);
