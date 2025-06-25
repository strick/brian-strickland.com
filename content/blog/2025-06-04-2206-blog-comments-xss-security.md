---
title: "Comment System with Azure SQL, XSS Protection, Honeypot, and Rate Limits"
date: "2025-06-04T22:06:00"
slug: "blog-comments-xss-security"
tags: [web-dev, security, azure, rate-limiting]
---

<p>This two-night project involved building a fully working blog comment system backed by Azure SQL. The goal was to allow readers to leave comments while enforcing solid security and a clean UX. Here's how it all came together.</p>

<h2>Setting up Azure SQL</h2>
<p>I chose <strong>Azure SQL Database</strong> for hosting comments — Microsoft’s free tier is perfect for small applications like this. I spun up a new logical SQL server with a basic database, configured a firewall rule to allow Azure services, and set up a secure connection string stored as <code>SQL_CONN_STRING</code> in my Azure Function App settings.</p>

<h2>Creating APIs with Azure Functions</h2>
<p>Two endpoints were built:</p>
<ul>
  <li><code>post-comment</code>: Accepts a comment and writes it to the database.</li>
  <li><code>get-comments</code>: Retrieves and returns comments per post.</li>
</ul>
<p>Each uses the <code>mssql</code> package to interact with the Azure SQL instance.</p>

<h2>Debugging an npm Issue</h2>
<p>One roadblock was that my outer <code>package.json</code> had <code>mssql</code> listed, but it wasn’t available in the <code>/api</code> subfolder where the Azure Function lives. I installed <code>mssql</code> directly inside <code>/api</code>, which fixed the issue. A good reminder that local structure matters in serverless apps.</p>

<h2>Adding Security</h2>
<p>I hardened the API in several ways:</p>
<ul>
  <li><strong>XSS Protection:</strong> Used <code>DOMPurify</code> to sanitize both <code>name</code> and <code>comment</code> server-side.</li>
  <li><strong>Honeypot:</strong> Added a hidden <code>website</code> field in the form. Bots filling this field get blocked immediately.</li>
  <li><strong>Rate Limiting:</strong> Implemented a server-side SQL-based limit of 5 requests per IP per minute using a <code>CommentRateLimit</code> table.</li>
  <li><strong>API Key:</strong> Added support for <code>x-api-key</code> headers for any write operations. Keys aren’t exposed in client JavaScript.</li>
</ul>

<h2>UX Improvements</h2>
<p>On the frontend, I added Bootstrap styling to make the comments more readable and visually distinct. Submitting a comment now displays a real-time success or error message, clears the form, and refreshes the comment list without reloading the page.</p>

<h2>Final Thoughts</h2>
<p>This comment system is fast, secure, and extensible. It runs on serverless architecture with minimal cost (Azure SQL free tier + Azure Functions), and it’s protected against spam, XSS, and simple bot attacks. All data is stored relationally, making it easy to expand later with moderation features or comment threading.</p>

<p>Another solid upgrade to the blog, fully automated and deployed via my Hugo + GitHub workflow.</p>
