const sql = require("mssql");
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;


module.exports = async function (context, req) {
  context.log("Function triggered: post-comment");


    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const now = Date.now();
    const requests = rateLimitMap.get(ip) || [];
    const recentRequests = requests.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    context.res = {
        status: 429,
        body: "Rate limit exceeded. Please wait a moment before trying again."
    };
    return;
    }

    // Add current request timestamp
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);



  try {
    // Validate and parse body
    //const { name, comment, post_slug } = req.body || {};

    const name = DOMPurify.sanitize(req.body?.name?.toString().trim() || '');
    const comment = DOMPurify.sanitize(req.body?.comment?.toString().trim() || '');
    const post_slug = req.body?.post_slug?.toString().trim() || '';
    const website = req.body?.website?.toString().trim() || '';

    // Honeypot check
    if (website) {
        context.res = {
            status: 403,
            body: "Bot detected (honeypot field filled in)"
        };
        return;
    }

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
