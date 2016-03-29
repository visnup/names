#!/bin/sh

export DATABASE_URL=${DATABASE_URL:-names}

psql ${DATABASE_URL} <<SQL
DROP TABLE IF EXISTS names;

CREATE TABLE names (
  name text NOT NULL,
  gender char(1) NOT NULL,
  state char(2) NOT NULL,
  year int NOT NULL,
  count int NOT NULL
);
SQL

cat ${PWD}/$(dirname $0)/ssa/*.TXT | \
psql -c 'COPY names (state, gender, year, name, count) FROM STDIN WITH CSV HEADER' ${DATABASE_URL}

psql ${DATABASE_URL} <<SQL
CREATE INDEX ON names (name, gender, state, year);
SQL
