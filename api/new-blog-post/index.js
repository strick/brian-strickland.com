const axios = require("axios");

module.exports = async function (context, req) {
  try {
    context.log("Function triggered");

    const API_KEY = process.env.BLOG_API_KEY;
    const incomingKey = req.headers["x-api-key"];

    if (!incomingKey || incomingKey !== API_KEY) {
      context.res = { status: 403, body: "Forbidden: Invalid API Key" };
      return;
    }

    const { title, content, slug, date } = req.body || {};
    if (!title || !content) {
      context.res = { status: 400, body: "Missing title or content" };
      return;
    }

    const now = new Date();
    const today = date || now.toISOString().split("T")[0];
   
    const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const time = `${String(estTime.getHours()).padStart(2, '0')}${String(estTime.getMinutes()).padStart(2, '0')}`;


    const safeSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, "");
    const filename = `blog/${today}-${time}-${safeSlug}.html`;
    const postUrl = `/blog/${today}-${time}-${safeSlug}.html`;


const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="stylesheet" href="/blog/blog.css" />
</head>
<body>
  <header>
    <h1>${title}</h1>
    <p class="date">${today} - ${time}</p>
  </header>
  <main>
    ${content}
    <footer>
      <p><a href="/blog/index.html">← Back to Blog</a></p>
    </footer>
  </main>
</body>
</html>`;


    const githubToken = process.env.AI_BLOG_GITHUB_TOKEN;
    const repo = "strick/brian-strickland.com";
    const branch = "main";

    // Create or update blog post file
    const postSHARes = await axios.get(
      `https://api.github.com/repos/${repo}/contents/${filename}`,
      {
        headers: { Authorization: `token ${githubToken}` },
        validateStatus: (status) => status < 500,
      }
    );
    const postExists = postSHARes.status === 200;
    const postSHA = postExists ? postSHARes.data.sha : undefined;

    await axios.put(
      `https://api.github.com/repos/${repo}/contents/${filename}`,
      {
        message: postExists ? `Update ${filename}` : `Add ${filename}`,
        content: Buffer.from(html).toString("base64"),
        branch,
        ...(postSHA && { sha: postSHA })
      },
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    // Update index.html
    const indexRes = await axios.get(
      `https://api.github.com/repos/${repo}/contents/blog/index.html`,
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    const indexHtmlDecoded = Buffer.from(indexRes.data.content, 'base64').toString('utf-8');
    const newEntry = `<!-- New blog posts will be listed here --><li><a href="${postUrl}">${title}</a></li>\n    `;

    const updatedIndexHtml = indexHtmlDecoded.replace(
      `<!-- New blog posts will be listed here -->`,
      newEntry
    );

    await axios.put(
      `https://api.github.com/repos/${repo}/contents/blog/index.html`,
      {
        message: `Add blog entry to index.html: ${title}`,
        content: Buffer.from(updatedIndexHtml).toString("base64"),
        branch,
        sha: indexRes.data.sha
      },
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    context.res = {
      status: 200,
      body: `Blog post and index.html updated: ${filename}`
    };

  } catch (err) {
    context.log("ERROR:", err.response?.data || err.message || err);
    context.res = {
      status: 500,
      body: `Error: ${err.response?.data?.message || err.message}`
    };
  }
};
