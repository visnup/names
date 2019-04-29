const { parse } = require("url");
const { json } = require("micro");
const cors = require("micro-cors")();
const serializeError = require("serialize-error");
const { BigQuery } = require("@google-cloud/bigquery");

const credentials = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"
);
const client = new BigQuery({ credentials, projectId: credentials.project_id });

module.exports = cors(async (req, res) => {
  try {
    let query, params;
    if (req.method === "POST") ({ query, params } = await json(req));
    else if (req.method === "GET")
      ({ query, params } = parse(req.url, true).query);
    else return {};

    console.log({ query, params });
    const [rows] = await client.query({ query, params, location: "US" });
    return rows;
  } catch (error) {
    res.statusCode = 500;
    delete error.stack;
    return serializeError(error);
  }
});
