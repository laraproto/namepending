#!/usr/bin/env bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER root;
	CREATE DATABASE namepending OWNER=root;
	GRANT ALL PRIVILEGES ON DATABASE namepending TO root;
EOSQL