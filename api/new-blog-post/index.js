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

    const today = date || new Date().toISOString().split("T")[0];
    const safeSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, "");
    const filename = `blog/${today}-${safeSlug}.html`;
    const postUrl = `/blog/${today}-${safeSlug}.html`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${title}" />
  <style>
    body { font-family: Georgia, serif; padding: 2rem; max-width: 800px; margin: auto; background: #fff; color: #333; }
    h1 { font-size: 2em; color: #007acc; }
    p { line-height: 1.6; }
    a { color: #007acc; text-decoration: none; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p><strong>Date:</strong> ${today}</p>
  ${content}
  <p><a href="/index.html">← Back to blog</a></p>
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
      `https://api.github.com/repos/${repo}/contents/index.html`,
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    const indexHtmlDecoded = Buffer.from(indexRes.data.content, 'base64').toString('utf-8');
    const newEntry = `    <li><a href="${postUrl}">${title}</a></li>\n    <!-- New blog posts will be listed here -->`;

    const updatedIndexHtml = indexHtmlDecoded.replace(
      `<!-- New blog posts will be listed here -->`,
      newEntry
    );

    await axios.put(
      `https://api.github.com/repos/${repo}/contents/index.html`,
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
