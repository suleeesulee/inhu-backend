CREATE USER inhu_log_admin WITH PASSWORD '1234';

CREATE DATABASE inhu_log OWNER inhu_log_admin;

\c inhu_log inhu_log_admin;

\i /rdb/ddl.sql