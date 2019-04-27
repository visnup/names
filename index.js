const { json, send } = require("micro");
const cors = require("micro-cors")();
const serializeError = require("serialize-error");
const { BigQuery } = require("@google-cloud/bigquery");

const credentials = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"
);
const client = new BigQuery({ credentials, projectId: credentials.project_id });

module.exports = cors(async (req, res) => {
  try {
    if (req.method !== "POST") return {};
    const { query, params, location = "US" } = await json(req);
    const [rows] = await client.query({ query, params, location });
    return rows;
  } catch (error) {
    send(res, 500, serializeError(error));
  }
});
