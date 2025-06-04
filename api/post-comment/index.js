const sql = require('mssql');

module.exports = async function (context, req) {
    context.log('--- post-comment triggered ---');

    try {
        const { name, comment, post_slug } = req.body || {};
        context.log('Received body:', { name, comment, post_slug });

        if (!name || !comment || !post_slug) {
            context.res = {
                status: 400,
                body: "Missing name, comment, or post_slug"
            };
            return;
        }

        await sql.connect(process.env.SQL_CONN_STRING);
        context.log('SQL connection established');

        await sql.query`
            INSERT INTO Comments (name, comment, post_slug)
            VALUES (${name}, ${comment}, ${post_slug})
        `;
        context.log('Comment inserted');

        context.res = {
            status: 200,
            body: "Comment added"
        };
    } catch (err) {
        context.log.error('Error occurred:', err); // LOG TO DEPLOYED APP
        context.res = {
            status: 500,
            body: `Function error: ${err.message || err.toString()}`
        };
    }
};
