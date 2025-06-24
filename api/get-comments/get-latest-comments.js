const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("Function triggered: get-latest-comments");

  try {
    context.log("Connecting to database...");
    const pool = await sql.connect(process.env.SQL_CONN_STRING);
    context.log("Database connection successful");

    const result = await pool.request()
      .query(`
        SELECT TOP 5 name, comment, timestamp, post_slug
        FROM Comments
        ORDER BY timestamp DESC
      `);

    context.log(`Retrieved ${result.recordset.length} latest comment(s)`);

    context.res = {
      status: 200,
      body: result.recordset
    };

  } catch (err) {
    context.log.error("ERROR:", err.message || err);
    context.res = {
      status: 500,
      body: `Function error: ${err.message || err.toString()}`
    };
  }
};
