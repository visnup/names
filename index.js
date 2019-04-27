const { json } = require("micro");
const cors = require("micro-cors")();
const { BigQuery } = require("@google-cloud/bigquery");

const credentials = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"
);
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;

module.exports = cors(async req => {
  if (req.method !== "POST") return {};

  const { query, params, location = "US" } = await json(req);

  const client = new BigQuery({
    credentials,
    projectId: credentials.project_id
  });
  const [rows] = await client.query({ query, params, location });
  return rows;
});
