const sql = require('mssql');

module.exports = async function (context, req) {
    context.log("POST /api/post-comment triggered");

    try {
        const { name, comment, post_slug } = req.body || {};
        context.log("Received body:", req.body);

        if (!name || !comment || !post_slug) {
            context.res = {
                status: 400,
                body: "Missing name, comment, or post_slug"
            };
            return;
        }

        context.log("Connecting to SQL...");
        await sql.connect(process.env.SQL_CONN_STRING);
        context.log("Connected to SQL");

        await sql.query`
            INSERT INTO Comments (name, comment, post_slug)
            VALUES (${name}, ${comment}, ${post_slug})
        `;

        context.res = {
            status: 200,
            body: "Comment added"
        };
    } catch (err) {
        context.log.error("ERROR:", err);
        context.res = {
            status: 500,
            body: `Function error: ${err.message}`
        };
    }
};
