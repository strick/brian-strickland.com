const sql = require('mssql');

module.exports = async function (context, req) {
    const post_slug = req.query.post;

    if (!post_slug) {
        context.res = {
            status: 400,
            body: "Missing ?post= query parameter"
        };
        return;
    }

    try {
        await sql.connect(process.env.SQL_CONN_STRING);
        const result = await sql.query`
            SELECT name, comment, timestamp
            FROM Comments
            WHERE post_slug = ${post_slug}
            ORDER BY timestamp DESC
        `;

        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "DB error: " + err.message
        };
    }
};
