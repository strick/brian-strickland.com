const sql = require("mssql");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

module.exports = async function (context, req) {
  context.log("Function triggered: post-comment");

  try {
    // Extract and sanitize fields
    const name = DOMPurify.sanitize(req.body?.name?.toString().trim() || '');
    const comment = DOMPurify.sanitize(req.body?.comment?.toString().trim() || '');
    const post_slug = DOMPurify.sanitize(req.body?.post_slug?.toString().trim() || '');
    const website = DOMPurify.sanitize(req.body?.website?.toString().trim() || '');

    // Honeypot bot trap
    if (website) {
      context.log("Honeypot triggered.");
      context.res = {
        status: 403,
        body: "Bot detected (honeypot field filled in)"
      };
      return;
    }

    if (!name || !comment || !post_slug) {
      context.res = {
        status: 400,
        body: "Missing name, comment, or post_slug"
      };
      return;
    }

    // Connect to SQL
    context.log("Connecting to database...");
    const pool = await sql.connect(process.env.SQL_CONN_STRING);
    context.log("Database connection successful");

    // Rate limiting by IP
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || '')
             .split(',')[0]
             .split(':')[0]
             .trim();

    const now = new Date();
    const windowStart = new Date(now.getTime() - 60 * 1000); // 1 minute window

    const rateResult = await pool.request()
      .input("ip", sql.NVarChar, ip)
      .input("since", sql.DateTime2, windowStart)
      .query(`
        SELECT COUNT(*) AS count
        FROM CommentLog
        WHERE ip_address = @ip AND timestamp >= @since
      `);

    if (rateResult.recordset[0].count >= 5) {
      context.log(`Rate limit exceeded for IP: ${ip}`);
      context.res = {
        status: 429,
        body: "Rate limit exceeded. Please wait a moment before trying again."
      };
      return;
    }

    // Log comment attempt
    await pool.request()
      .input("ip", sql.NVarChar, ip)
      .input("timestamp", sql.DateTime2, now)
      .query(`
        INSERT INTO CommentLog (ip_address, timestamp)
        VALUES (@ip, @timestamp)
      `);

    // Insert actual comment
    await pool.request()
      .input("name", sql.NVarChar, name)
      .input("comment", sql.NVarChar, comment)
      .input("post_slug", sql.NVarChar, post_slug)
      .query(`
        INSERT INTO Comments (name, comment, post_slug)
        VALUES (@name, @comment, @post_slug)
      `);

    context.log("Comment inserted successfully.");

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
