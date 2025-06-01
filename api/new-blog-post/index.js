const axios = require("axios");

module.exports = async function (context, req) {
  try {
    context.log("Function triggered");

    const { title, content, slug, date } = req.body || {};
    context.log("Received payload:", { title, slug, date });

    if (!title || !content) {
      context.res = { status: 400, body: "Missing title or content" };
      return;
    }

    const today = date || new Date().toISOString().split("T")[0];
    const safeSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, "");
    const filename = `blog/${today}-${safeSlug}.html`;

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
</body>
</html>`;

    const githubToken = process.env.AI_BLOG_GITHUB_TOKEN;
    if (!githubToken) {
      context.log("Missing GitHub token!");
      context.res = { status: 500, body: "GitHub token is not set." };
      return;
    }

    const repo = "strick/brian-strickland.com";
    const branch = "main";

    context.log("Checking if file already exists:", filename);

    const getSHAResponse = await axios.get(
      `https://api.github.com/repos/${repo}/contents/${filename}`,
      {
        headers: { Authorization: `token ${githubToken}` },
        validateStatus: (status) => status < 500,
      }
    );

    const isUpdating = getSHAResponse.status === 200;
    const sha = isUpdating ? getSHAResponse.data.sha : undefined;

    context.log(`Committing file (${isUpdating ? "updating" : "creating"}):`, filename);

    const commitResponse = await axios.put(
      `https://api.github.com/repos/${repo}/contents/${filename}`,
      {
        message: isUpdating ? `Update ${filename}` : `Add ${filename}`,
        content: Buffer.from(html).toString("base64"),
        branch,
        ...(sha && { sha })
      },
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    context.log("Commit response:", commitResponse.data.content.path);

    context.res = {
      status: 200,
      body: `Blog post committed as ${filename}`
    };
  } catch (err) {
    context.log("ERROR:", err.response?.data || err.message || err);
    context.res = {
      status: 500,
      body: `Error: ${err.response?.data?.message || err.message}`
    };
  }
};
