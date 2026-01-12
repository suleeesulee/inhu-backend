CREATE USER inhu_admin WITH PASSWORD '1234';

-- Debezium CDC 유저 생성
CREATE USER debezium WITH PASSWORD 'debezium' REPLICATION;

CREATE DATABASE inhu OWNER inhu_admin;

\c inhu inhu_admin;

\i /rdb/ddl.sql

\i /rdb/default-seed.sql

\c inhu postgres;

-- Debezium용 publication (전체 테이블)
CREATE PUBLICATION debezium_pub FOR ALL TABLES;

-- Debezium 권한 설정
GRANT CONNECT ON DATABASE inhu TO debezium;
GRANT CREATE ON DATABASE inhu TO debezium;
GRANT USAGE, CREATE ON SCHEMA public TO debezium;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO debezium;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO debezium;

INSERT INTO user_tb (nickname) VALUES ('nickname1');

\c inhu inhu_admin;

INSERT INTO admin_account_tb (idx, id, pw) VALUES (1, '1234', '$2b$10$l.EPjNQZOAdfiLqk5Lp8sujej5a7MTVCV7KL1z9wykrAZz04uSLLG');