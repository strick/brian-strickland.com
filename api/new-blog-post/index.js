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
    const filename = `content/blog/${today}-${time}-${safeSlug}.md`;

    // Hugo-style Markdown with front matter
    const markdown = `---
title: "${title}"
date: "${today}T${time.slice(0, 2)}:${time.slice(2)}:00"
slug: "${safeSlug}"
---

${content}
`;

    const githubToken = process.env.AI_BLOG_GITHUB_TOKEN;
    const repo = "strick/brian-strickland.com";
    const branch = "main";

    const fileCheck = await axios.get(
      `https://api.github.com/repos/${repo}/contents/${filename}`,
      {
        headers: { Authorization: `token ${githubToken}` },
        validateStatus: (status) => status < 500,
      }
    );

    const fileExists = fileCheck.status === 200;
    const sha = fileExists ? fileCheck.data.sha : undefined;

    await axios.put(
      `https://api.github.com/repos/${repo}/contents/${filename}`,
      {
        message: fileExists ? `Update ${filename}` : `Add ${filename}`,
        content: Buffer.from(markdown).toString("base64"),
        branch,
        ...(sha && { sha })
      },
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    context.res = {
      status: 200,
      body: `Blog Markdown saved as: ${filename}`
    };

  } catch (err) {
    context.log("ERROR:", err.response?.data || err.message || err);
    context.res = {
      status: 500,
      body: `Error: ${err.response?.data?.message || err.message}`
    };
  }
};
