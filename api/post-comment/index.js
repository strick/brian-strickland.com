const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("Function triggered: post-comment");

    const API_KEY = process.env.BLOG_API_KEY;
    const incomingKey = req.headers["x-api-key"];

    if (!incomingKey || incomingKey !== API_KEY) {
      context.res = { status: 403, body: "Forbidden: Invalid API Key" };
      return;
    }


  try {
    // Validate and parse body
    const { name, comment, post_slug } = req.body || {};
    context.log("Received body:", { name, comment, post_slug });

    if (!name || !comment || !post_slug) {
      context.res = { status: 400, body: "Missing name, comment, or post_slug" };
      return;
    }

    // Connect to Azure SQL
    context.log("Connecting to database...");
    const pool = await sql.connect(process.env.SQL_CONN_STRING);
    context.log("Database connection successful");

    // Insert the comment
    await pool.request()
      .input("name", sql.NVarChar, name)
      .input("comment", sql.NVarChar, comment)
      .input("post_slug", sql.NVarChar, post_slug)
      .query(`
        INSERT INTO Comments (name, comment, post_slug)
        VALUES (@name, @comment, @post_slug)
      `);

    context.log("Comment inserted successfully");

    context.res = {
      status: 200,
      body: {
        message: "Comment added successfully",
        post_slug
      }
    };

  } catch (err) {
    context.log.error("ERROR:", err.message || err);
    context.res = {
      status: 500,
      body: `Function error: ${err.message || err.toString()}`
    };
  }
};
