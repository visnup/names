#!/bin/sh

export DATABASE_URL=${DATABASE_URL:-names}

psql ${DATABASE_URL} <<SQL
DROP TABLE IF EXISTS names;

CREATE TABLE names (
  name text,
  gender char(1) NOT NULL,
  state char(2),
  year int NOT NULL,
  count int NOT NULL
);
SQL

for file in ${PWD}/$(dirname $0)/names/yob*.txt; do
  year=$(echo $file | sed 's/.*yob\([0-9]*\).txt/\1/')
  cat $file | sed "s/^/${year},/" | \
  psql -c "COPY names (year, name, gender, count) FROM STDIN WITH CSV" ${DATABASE_URL}
done

cat ${PWD}/$(dirname $0)/namesbystate/*.TXT | \
psql -c 'COPY names (state, gender, year, name, count) FROM STDIN WITH CSV HEADER' ${DATABASE_URL}
psql -c 'INSERT INTO names (gender, state, year, count)
  SELECT gender, state, year, SUM(count)
  FROM names
  GROUP BY gender, state, year' ${DATABASE_URL}

psql ${DATABASE_URL} <<SQL
CREATE INDEX ON names (name, gender, state, year);
SQL
