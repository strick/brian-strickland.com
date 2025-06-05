const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("Function triggered: get-comments");

  try {
    const post_slug = req.query.post;
    context.log("Received query param:", post_slug);

    if (!post_slug) {
      context.res = {
        status: 400,
        body: "Missing ?post= query parameter"
      };
      return;
    }

    context.log("Connecting to database...");
    const pool = await sql.connect(process.env.SQL_CONN_STRING);
    context.log("Database connection successful");

    const result = await pool.request()
      .input("post_slug", sql.NVarChar, post_slug)
      .query(`
        SELECT name, comment, timestamp
        FROM Comments
        WHERE post_slug = @post_slug
        ORDER BY timestamp DESC
      `);

    context.log(`Retrieved ${result.recordset.length} comment(s)`);

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
