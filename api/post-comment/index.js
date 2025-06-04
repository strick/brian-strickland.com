const sql = require('mssql');

module.exports = async function (context, req) {
    context.log("Function triggered");

    const { name, comment, post_slug } = req.body;
    context.log("Payload received:", { name, comment, post_slug });

    if (!name || !comment || !post_slug) {
        context.res = {
            status: 400,
            body: "Missing name, comment, or post_slug"
        };
        return;
    }

    try {
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
        context.log("DB error:", err.message);  // ✅ this is important
        context.res = {
            status: 500,
            body: "DB error: " + err.message
        };
    }
};
