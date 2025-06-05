---
title: "Secure Blog Comment System with Rate Limiting and XSS Protection"
date: "2025-06-04T22:06:00"
slug: "blog-comments-xss-security"
---

<h3>Commenting Done Right: Secure, Functional, and User-Friendly</h3>

<p>This two-night project was all about building and securing a fully functional blog comment system from scratch, using Azure Functions, SQL, and frontend JavaScript. The goal: allow users to submit comments to each blog post while keeping the system fast, safe, and spam-resistant.</p>

<h4>🔧 Backend: API + Database</h4>
<p>I created two Azure Function endpoints:</p>
<ul>
  <li><code>/api/get-comments</code>: Fetches comments for a given post_slug</li>
  <li><code>/api/post-comment</code>: Accepts and stores new comments securely</li>
</ul>

<p>Each comment is stored in a SQL database table <code>Comments</code> with fields: <code>name</code>, <code>comment</code>, <code>post_slug</code>, and <code>timestamp</code>. I ran into an early snag when <code>mssql</code> was missing — turns out I had my <code>package.json</code> in the root directory, not in the <code>/api</code> folder where Azure Functions runs. Reinstalled in the right place and everything clicked.</p>

<h4>🛡️ Security Enhancements</h4>
<ul>
  <li><strong>XSS protection</strong>: Used <code>DOMPurify</code> on the server and escaped HTML client-side to sanitize inputs before rendering.</li>
  <li><strong>Honeypot field</strong>: Included a hidden <code>website</code> field in the form to catch bots. If filled, the request is blocked.</li>
  <li><strong>API Key</strong>: Protected the <code>post-comment</code> endpoint with an <code>x-api-key</code> header.</li>
  <li><strong>Rate limiting</strong>: Implemented basic per-IP rate limiting in the API using a SQL table to prevent comment spam.</li>
</ul>

<h4>💡 UX Improvements</h4>
<ul>
  <li><strong>Live feedback</strong>: Added a loading message while posting comments, disabled the submit button during requests, and scrolled to the response status.</li>
  <li><strong>Visual polish</strong>: Used Bootstrap to cleanly display comments inside styled cards with timestamp, author name, and formatted text.</li>
  <li><strong>Auto-refresh</strong>: After posting a comment, the comments reload automatically so users see their message without refreshing the page.</li>
</ul>

<h4>🧠 Final Thoughts</h4>
<p>This wasn’t just a feature drop — it was a full walkthrough of what secure and maintainable frontend/backend integration looks like. From XSS hardening and bot traps to rate limits and real-time UI updates, the system is now fast, functional, and ready for real users — while also giving me complete control and flexibility via my static Hugo blog with API-backed dynamic features.</p>
