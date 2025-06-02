---
title: "Secure Blog Publishing API: Lessons Learned and Setup"
date: 2025-06-01T00:00:00
slug: secure-blog-publishing-api
---

Today marked a big milestone in automating my personal blog: I successfully implemented a **secure API-based publishing workflow** that allows trusted services (like ChatGPT or custom tools) to post new blog entries to my static site—all while keeping GitHub access safe and private.

## What I Built

- Azure Static Web App at `brian-strickland.com`
- Azure Function `/api/new-blog-post` with:
  - `x-api-key` header security
  - GitHub commit using token from environment
- Flexible post submission via JSON:

```json
{
  "title": "My Blog Title",
  "slug": "my-blog-title",
  "date": "2025-06-01",
  "content": "<p>Post content here</p>"
}
